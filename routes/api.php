<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\VehicleBookingController;
use App\Http\Controllers\Api\BookingApprovalController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/vehicle-usage', [DashboardController::class, 'vehicleUsage']);
    Route::get('/dashboard/fuel-consumption', [DashboardController::class, 'fuelConsumption']);
    Route::get('/dashboard/booking-trend', [DashboardController::class, 'bookingTrend']);
    
    // Vehicles
    Route::apiResource('vehicles', VehicleController::class);
    Route::get('/drivers', [VehicleController::class, 'drivers']);
    Route::get('/approvers', [VehicleController::class, 'approvers']);
    
    // Vehicle Monitoring
    Route::get('/monitoring/fuel-consumption/{id?}', [VehicleController::class, 'fuelConsumption']);
    Route::get('/monitoring/service-schedule', [VehicleController::class, 'serviceSchedule']);
    Route::get('/monitoring/usage-history/{id}', [VehicleController::class, 'usageHistory']);
    
    // Bookings (Admin only can create)
    Route::get('/bookings', [VehicleBookingController::class, 'index']);
    Route::get('/bookings/{id}', [VehicleBookingController::class, 'show']);
    Route::middleware('admin')->group(function () {
        Route::post('/bookings', [VehicleBookingController::class, 'store']);
        Route::put('/bookings/{id}', [VehicleBookingController::class, 'update']);
        Route::delete('/bookings/{id}', [VehicleBookingController::class, 'destroy']);
    });
    
    // Complete booking (Driver only)
    Route::middleware('driver')->group(function () {
        Route::post('/bookings/{id}/complete', [VehicleBookingController::class, 'complete']);
    });
    
    // Approvals
    Route::get('/my-approvals', [BookingApprovalController::class, 'myApprovals']);
    Route::post('/approvals/{id}/approve', [BookingApprovalController::class, 'approve']);
    
    // Reports
    Route::get('/reports/export-bookings', [ReportController::class, 'exportBookings']);
    
    // User Management
    Route::apiResource('users', UserController::class);
    Route::get('/roles', [UserController::class, 'roles']);
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/change-password', [ProfileController::class, 'changePassword']);
    
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
});
