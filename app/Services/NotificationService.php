<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\VehicleBooking;
use App\Models\User;

class NotificationService
{
    public static function createBookingNotification(VehicleBooking $booking)
    {
        // Notify ALL admin users (not just the creator)
        $admins = User::whereHas('role', function($query) {
            $query->where('name', 'admin');
        })->get();
        
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'booking_created',
                'title' => 'Pemesanan Berhasil Dibuat',
                'message' => "Pemesanan kendaraan {$booking->vehicle->name} telah dibuat dan menunggu persetujuan.",
                'booking_id' => $booking->id,
            ]);
        }

        // Notify all approvers
        foreach ($booking->approvals as $approval) {
            Notification::create([
                'user_id' => $approval->approver_id,
                'type' => 'booking_pending_approval',
                'title' => 'Persetujuan Dibutuhkan',
                'message' => "Pemesanan kendaraan {$booking->vehicle->name} memerlukan persetujuan Anda (Level {$approval->level}).",
                'booking_id' => $booking->id,
            ]);
        }
    }

    public static function bookingApprovedNotification(VehicleBooking $booking, $approverName, $level)
    {
        // Notify ALL admin users
        $admins = User::whereHas('role', function($query) {
            $query->where('name', 'admin');
        })->get();
        
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'booking_approved',
                'title' => 'Pemesanan Disetujui',
                'message' => "Pemesanan kendaraan {$booking->vehicle->name} telah disetujui oleh {$approverName} (Level {$level}).",
                'booking_id' => $booking->id,
            ]);
        }

        // Notify driver
        Notification::create([
            'user_id' => $booking->driver_id,
            'type' => 'booking_approved',
            'title' => 'Tugas Baru',
            'message' => "Anda ditugaskan untuk mengendarai {$booking->vehicle->name} dari {$booking->start_date} hingga {$booking->end_date}.",
            'booking_id' => $booking->id,
        ]);
    }

    public static function bookingRejectedNotification(VehicleBooking $booking, $approverName, $level, $notes)
    {
        // Notify ALL admin users
        $admins = User::whereHas('role', function($query) {
            $query->where('name', 'admin');
        })->get();
        
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'booking_rejected',
                'title' => 'Pemesanan Ditolak',
                'message' => "Pemesanan kendaraan {$booking->vehicle->name} ditolak oleh {$approverName} (Level {$level}). Alasan: " . ($notes ?: 'Tidak ada catatan'),
                'booking_id' => $booking->id,
            ]);
        }
    }

    public static function bookingCompletedNotification(VehicleBooking $booking)
    {
        // Notify ALL admin users
        $admins = User::whereHas('role', function($query) {
            $query->where('name', 'admin');
        })->get();
        
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'booking_completed',
                'title' => 'Pemesanan Selesai',
                'message' => "Pemesanan kendaraan {$booking->vehicle->name} telah diselesaikan.",
                'booking_id' => $booking->id,
            ]);
        }

        // Notify driver
        Notification::create([
            'user_id' => $booking->driver_id,
            'type' => 'booking_completed',
            'title' => 'Tugas Selesai',
            'message' => "Tugas mengendarai {$booking->vehicle->name} telah selesai. Terima kasih!",
            'booking_id' => $booking->id,
        ]);
    }
}
