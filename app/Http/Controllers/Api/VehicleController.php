<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VehicleController extends Controller
{
    public function index()
    {
        $vehicles = Vehicle::with('office')->paginate(20);
        return response()->json($vehicles);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'office_id' => 'required|exists:offices,id',
            'name' => 'required|string',
            'license_plate' => 'required|string|unique:vehicles',
            'type' => 'required|in:angkutan_orang,angkutan_barang',
            'ownership' => 'required|in:milik_perusahaan,sewa',
            'fuel_consumption' => 'nullable|numeric',
            'odometer' => 'nullable|integer',
            'last_service_date' => 'nullable|date',
            'next_service_date' => 'nullable|date',
            'service_interval_km' => 'nullable|integer',
        ]);

        $vehicle = Vehicle::create($validated);
        Log::info('Vehicle created', ['vehicle_id' => $vehicle->id]);
        
        return response()->json($vehicle, 201);
    }

    public function show($id)
    {
        $vehicle = Vehicle::with([
            'office', 
            'bookings' => function($query) {
                $query->orderBy('created_at', 'desc')->limit(10);
            },
            'bookings.driver',
            'bookings.bookedBy',
            'logs' => function($query) {
                $query->orderBy('created_at', 'desc')->limit(10);
            }
        ])->findOrFail($id);
        
        return response()->json($vehicle);
    }

    public function update(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);
        
        $validated = $request->validate([
            'office_id' => 'sometimes|exists:offices,id',
            'name' => 'sometimes|string',
            'license_plate' => 'sometimes|string|unique:vehicles,license_plate,' . $id,
            'type' => 'sometimes|in:angkutan_orang,angkutan_barang',
            'ownership' => 'sometimes|in:milik_perusahaan,sewa',
            'fuel_consumption' => 'nullable|numeric',
            'odometer' => 'nullable|integer',
            'last_service_date' => 'nullable|date',
            'next_service_date' => 'nullable|date',
            'service_interval_km' => 'nullable|integer',
            'status' => 'sometimes|in:tersedia,digunakan,maintenance',
        ]);

        $vehicle->update($validated);
        Log::info('Vehicle updated', ['vehicle_id' => $vehicle->id]);
        
        return response()->json($vehicle);
    }

    public function destroy($id)
    {
        $vehicle = Vehicle::findOrFail($id);
        $vehicle->delete();
        
        Log::info('Vehicle deleted', ['vehicle_id' => $id]);
        
        return response()->json(['message' => 'Vehicle deleted successfully']);
    }

    public function drivers()
    {
        $drivers = User::where('role_id', 4)->with(['office', 'role'])->get();
        return response()->json($drivers);
    }

    public function approvers()
    {
        $approvers = User::whereIn('role_id', [2, 3])->with(['office', 'role'])->get();
        return response()->json($approvers);
    }

    // Monitoring Methods
    
    /**
     * Get fuel consumption statistics
     */
    public function fuelConsumption($id = null)
    {
        $query = Vehicle::with('office');
        
        if ($id) {
            $vehicle = $query->findOrFail($id);
            $logs = $vehicle->logs()
                ->where('type', 'fuel')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();
                
            return response()->json([
                'vehicle' => $vehicle,
                'fuel_logs' => $logs,
                'average_consumption' => $vehicle->fuel_consumption,
            ]);
        }
        
        // All vehicles summary
        $vehicles = $query->get()->map(function($vehicle) {
            $totalFuel = $vehicle->logs()->where('type', 'fuel')->sum('fuel_amount');
            $totalDistance = $vehicle->logs()->where('type', 'usage')->sum('distance');
            
            return [
                'id' => $vehicle->id,
                'name' => $vehicle->name,
                'license_plate' => $vehicle->license_plate,
                'office' => $vehicle->office->name,
                'fuel_consumption' => $vehicle->fuel_consumption,
                'total_fuel_used' => $totalFuel,
                'total_distance' => $totalDistance,
                'actual_consumption' => $totalDistance > 0 ? ($totalFuel / $totalDistance) * 100 : 0,
            ];
        });
        
        return response()->json($vehicles);
    }

    /**
     * Get service schedule
     */
    public function serviceSchedule()
    {
        $vehicles = Vehicle::with('office')
            ->whereNotNull('next_service_date')
            ->orderBy('next_service_date', 'asc')
            ->get()
            ->map(function($vehicle) {
                $daysUntilService = now()->diffInDays($vehicle->next_service_date, false);
                $kmUntilService = $vehicle->service_interval_km ? 
                    $vehicle->service_interval_km - ($vehicle->odometer % $vehicle->service_interval_km) : 
                    null;
                
                return [
                    'id' => $vehicle->id,
                    'name' => $vehicle->name,
                    'license_plate' => $vehicle->license_plate,
                    'office' => $vehicle->office->name,
                    'odometer' => $vehicle->odometer,
                    'last_service_date' => $vehicle->last_service_date,
                    'next_service_date' => $vehicle->next_service_date,
                    'service_interval_km' => $vehicle->service_interval_km,
                    'days_until_service' => round($daysUntilService),
                    'km_until_service' => $kmUntilService,
                    'needs_service_soon' => $daysUntilService <= 7 || ($kmUntilService !== null && $kmUntilService <= 500),
                ];
            })
            ->filter(function($vehicle) {
                // Only include vehicles that need service soon (≤7 days or overdue, or ≤500km)
                return $vehicle['days_until_service'] <= 7 || 
                       ($vehicle['km_until_service'] !== null && $vehicle['km_until_service'] <= 500);
            })
            ->values(); // Reset array keys after filter
        
        return response()->json($vehicles);
    }

    /**
     * Get vehicle usage history
     */
    public function usageHistory($id)
    {
        $vehicle = Vehicle::with('office')->findOrFail($id);
        
        $history = $vehicle->logs()
            ->with(['booking.driver', 'booking.approvals.approver'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        $stats = [
            'total_usage' => $vehicle->logs()->where('type', 'usage')->count(),
            'total_distance' => $vehicle->logs()->where('type', 'usage')->sum('distance'),
            'total_fuel' => $vehicle->logs()->where('type', 'fuel')->sum('fuel_amount'),
            'total_service' => $vehicle->logs()->where('type', 'service')->count(),
        ];
        
        return response()->json([
            'vehicle' => $vehicle,
            'history' => $history,
            'stats' => $stats,
        ]);
    }
}
