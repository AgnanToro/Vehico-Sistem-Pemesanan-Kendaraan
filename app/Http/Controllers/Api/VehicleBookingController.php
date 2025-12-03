<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VehicleBooking;
use App\Models\BookingApproval;
use App\Models\Vehicle;
use App\Models\VehicleLog;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VehicleBookingController extends Controller
{
    public function index()
    {
        $bookings = VehicleBooking::with(['vehicle', 'driver', 'bookedBy', 'approvals.approver'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        return response()->json($bookings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'driver_id' => 'required|exists:users,id',
            'client_name' => 'required|string|max:255',
            'client_phone' => 'required|string|max:20',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'purpose' => 'required|string',
            'destination' => 'required|string',
            'approvers' => 'required|array|min:2',
            'approvers.*' => 'required|exists:users,id',
        ]);

        DB::beginTransaction();
        try {
            $booking = VehicleBooking::create([
                'vehicle_id' => $validated['vehicle_id'],
                'driver_id' => $validated['driver_id'],
                'booked_by' => $request->user()->id,
                'client_name' => $validated['client_name'],
                'client_phone' => $validated['client_phone'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'purpose' => $validated['purpose'],
                'destination' => $validated['destination'],
                'status' => 'pending',
            ]);

            foreach ($validated['approvers'] as $index => $approverId) {
                BookingApproval::create([
                    'booking_id' => $booking->id,
                    'approver_id' => $approverId,
                    'level' => $index + 1,
                    'status' => 'pending',
                ]);
            }

            // Vehicle status will be updated to 'digunakan' only when booking is approved
            // Not here when booking is created (still pending)

            // Create notifications
            NotificationService::createBookingNotification($booking->load(['vehicle', 'approvals']));

            DB::commit();
            Log::info('Booking created', ['booking_id' => $booking->id, 'user' => $request->user()->email]);

            return response()->json($booking->load(['vehicle', 'driver', 'approvals.approver']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Booking creation failed', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Gagal membuat pemesanan'], 500);
        }
    }

    public function show($id)
    {
        $booking = VehicleBooking::with(['vehicle.office', 'driver', 'bookedBy', 'approvals.approver', 'logs'])
            ->findOrFail($id);
        
        return response()->json($booking);
    }

    public function update(Request $request, $id)
    {
        $booking = VehicleBooking::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'sometimes|in:pending,approved,rejected,completed',
        ]);

        $booking->update($validated);
        Log::info('Booking updated', ['booking_id' => $booking->id, 'status' => $booking->status]);

        return response()->json($booking->load(['vehicle', 'driver', 'approvals.approver']));
    }

    public function destroy($id)
    {
        $booking = VehicleBooking::findOrFail($id);
        
        if ($booking->status !== 'pending') {
            return response()->json(['message' => 'Tidak dapat menghapus pemesanan yang bukan pending'], 400);
        }

        Vehicle::where('id', $booking->vehicle_id)->update(['status' => 'tersedia']);
        $booking->delete();
        
        Log::info('Booking deleted', ['booking_id' => $id]);
        
        return response()->json(['message' => 'Pemesanan berhasil dihapus']);
    }

    /**
     * Complete booking and log fuel usage
     */
    public function complete(Request $request, $id)
    {
        $booking = VehicleBooking::with('vehicle')->findOrFail($id);
        
        // Only approved bookings can be completed
        if ($booking->status !== 'approved') {
            return response()->json(['message' => 'Hanya pemesanan yang disetujui dapat diselesaikan'], 400);
        }

        $validated = $request->validate([
            'odometer_end' => 'required|integer|min:0',
            'fuel_used' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        // Get vehicle current odometer
        $vehicle = $booking->vehicle;
        $odometerStart = $vehicle->odometer;
        $odometerEnd = $validated['odometer_end'];
        $distance = $odometerEnd - $odometerStart;

        // Validate odometer end must be greater than start
        if ($odometerEnd <= $odometerStart) {
            return response()->json([
                'message' => 'Odometer akhir harus lebih besar dari odometer saat ini',
                'current_odometer' => $odometerStart,
            ], 400);
        }

        // Create vehicle log for fuel usage
        VehicleLog::create([
            'vehicle_id' => $booking->vehicle_id,
            'booking_id' => $booking->id,
            'type' => 'fuel',
            'fuel_amount' => $validated['fuel_used'],
            'odometer' => $odometerEnd,
            'odometer_start' => $odometerStart,
            'odometer_end' => $odometerEnd,
            'distance' => $distance,
            'notes' => $validated['notes'] ?? 'Booking completed',
        ]);

        // Update vehicle odometer
        $vehicle->update(['odometer' => $odometerEnd]);

        // Update booking status to completed
        $booking->update(['status' => 'completed']);

        // Update vehicle status back to available
        $vehicle->update(['status' => 'tersedia']);

        // Send completion notifications
        NotificationService::bookingCompletedNotification($booking->fresh(['vehicle']));

        Log::info('Booking completed', [
            'booking_id' => $booking->id,
            'distance' => $distance,
            'fuel_used' => $validated['fuel_used'],
        ]);

        return response()->json([
            'message' => 'Booking completed successfully',
            'booking' => $booking->fresh(),
            'distance' => $distance,
            'fuel_consumption' => $distance > 0 ? ($validated['fuel_used'] / $distance) * 100 : 0,
        ]);
    }
}
