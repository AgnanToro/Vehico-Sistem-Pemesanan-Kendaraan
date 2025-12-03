<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\VehicleBooking;
use App\Models\VehicleLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalVehicles = Vehicle::count();
        $availableVehicles = Vehicle::where('status', 'tersedia')->count();
        $inUseVehicles = Vehicle::where('status', 'digunakan')->count();
        $pendingBookings = VehicleBooking::where('status', 'pending')->count();
        $approvedBookings = VehicleBooking::where('status', 'approved')->count();

        return response()->json([
            'total_vehicles' => $totalVehicles,
            'available_vehicles' => $availableVehicles,
            'in_use_vehicles' => $inUseVehicles,
            'pending_bookings' => $pendingBookings,
            'approved_bookings' => $approvedBookings,
        ]);
    }

    public function vehicleUsage(Request $request)
    {
        $period = $request->get('period', '30');
        
        $usage = VehicleBooking::select(
                'vehicles.name',
                DB::raw('COUNT(*) as booking_count')
            )
            ->join('vehicles', 'vehicle_bookings.vehicle_id', '=', 'vehicles.id')
            ->where('vehicle_bookings.created_at', '>=', now()->subDays($period))
            ->groupBy('vehicles.id', 'vehicles.name')
            ->orderBy('booking_count', 'desc')
            ->get();

        return response()->json($usage);
    }

    public function fuelConsumption(Request $request)
    {
        $period = $request->get('period', '30');
        
        $fuel = VehicleLog::select(
                'vehicles.name',
                DB::raw('SUM(vehicle_logs.fuel_amount) as total_fuel')
            )
            ->join('vehicles', 'vehicle_logs.vehicle_id', '=', 'vehicles.id')
            ->where('vehicle_logs.type', 'fuel')
            ->where('vehicle_logs.created_at', '>=', now()->subDays($period))
            ->groupBy('vehicles.id', 'vehicles.name')
            ->orderBy('total_fuel', 'desc')
            ->get();

        return response()->json($fuel);
    }

    public function bookingTrend(Request $request)
    {
        $months = $request->get('months', 6);
        
        $trend = VehicleBooking::select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', now()->subMonths($months))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json($trend);
    }
}
