<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookingApproval;
use App\Models\VehicleBooking;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BookingApprovalController extends Controller
{
    public function myApprovals(Request $request)
    {
        $approvals = BookingApproval::with(['booking.vehicle', 'booking.driver'])
            ->where('approver_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        return response()->json($approvals);
    }

    public function approve(Request $request, $id)
    {
        $approval = BookingApproval::findOrFail($id);
        
        if ($approval->approver_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'notes' => 'nullable|string',
        ]);

        $approval->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? null,
            'approved_at' => now(),
        ]);

        Log::info('Approval updated', [
            'approval_id' => $approval->id,
            'status' => $approval->status,
            'approver' => $request->user()->email
        ]);

        if ($validated['status'] === 'rejected') {
            $booking = VehicleBooking::findOrFail($approval->booking_id);
            $booking->update(['status' => 'rejected']);
            
            // If booking is rejected, vehicle should remain/become available
            \App\Models\Vehicle::where('id', $booking->vehicle_id)->update(['status' => 'tersedia']);
            
            // Send rejection notification
            NotificationService::bookingRejectedNotification(
                $booking->load('vehicle'),
                $request->user()->name,
                $approval->level,
                $validated['notes']
            );
            
            Log::info('Booking rejected', ['booking_id' => $approval->booking_id]);
        } else {
            $allApprovals = BookingApproval::where('booking_id', $approval->booking_id)->get();
            $allApproved = $allApprovals->every(fn($a) => $a->status === 'approved');

            if ($allApproved) {
                $booking = VehicleBooking::findOrFail($approval->booking_id);
                $booking->update(['status' => 'approved']);
                
                // Update vehicle status to 'digunakan' when booking is approved
                \App\Models\Vehicle::where('id', $booking->vehicle_id)->update(['status' => 'digunakan']);
                
                // Send approval notification
                NotificationService::bookingApprovedNotification(
                    $booking->load('vehicle'),
                    $request->user()->name,
                    $approval->level
                );
                
                Log::info('Booking approved', ['booking_id' => $approval->booking_id]);
            }
        }

        return response()->json($approval->load(['booking', 'approver']));
    }
}
