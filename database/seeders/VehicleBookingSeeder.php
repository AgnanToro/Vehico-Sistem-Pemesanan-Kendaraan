<?php

namespace Database\Seeders;

use App\Models\VehicleBooking;
use App\Models\BookingApproval;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Notification;
use Illuminate\Database\Seeder;

class VehicleBookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get users
        $admin = User::where('email', 'admin@sekawan.com')->first();
        $approver1 = User::where('email', 'approver1@sekawan.com')->first();
        $approver2 = User::where('email', 'approver2@sekawan.com')->first();
        $driver1 = User::where('email', 'driver1@sekawan.com')->first();
        $driver2 = User::where('email', 'driver2@sekawan.com')->first();
        
        // Get vehicles
        $vehicles = Vehicle::all();

        // Booking 1: Completed - Toyota Avanza (sudah selesai di masa lalu)
        $booking1 = VehicleBooking::create([
            'vehicle_id' => $vehicles[3]->id, // Toyota Avanza
            'driver_id' => $driver1->id,
            'booked_by' => $admin->id,
            'client_name' => 'PT. Maju Sejahtera',
            'client_phone' => '081234567890',
            'start_date' => '2025-11-25 08:00:00',
            'end_date' => '2025-11-26 17:00:00',
            'purpose' => 'Antar jemput klien dari bandara',
            'destination' => 'Bandara Soekarno-Hatta',
            'status' => 'completed',
        ]);

        BookingApproval::create([
            'booking_id' => $booking1->id,
            'approver_id' => $approver1->id,
            'level' => 1,
            'status' => 'approved',
            'approved_at' => now()->subDays(10),
            'notes' => 'Disetujui',
        ]);

        BookingApproval::create([
            'booking_id' => $booking1->id,
            'approver_id' => $approver2->id,
            'level' => 2,
            'status' => 'approved',
            'approved_at' => now()->subDays(9),
            'notes' => 'OK',
        ]);

        // Booking 2: Rejected - Hino Dutro (ditolak)
        $booking2 = VehicleBooking::create([
            'vehicle_id' => $vehicles[5]->id, // Hino Dutro
            'driver_id' => $driver2->id,
            'booked_by' => $admin->id,
            'client_name' => 'CV. Berkah Logistik',
            'client_phone' => '082345678901',
            'start_date' => '2025-11-28 07:00:00',
            'end_date' => '2025-11-29 18:00:00',
            'purpose' => 'Pengiriman barang ke Surabaya',
            'destination' => 'Surabaya, Jawa Timur',
            'status' => 'rejected',
        ]);

        BookingApproval::create([
            'booking_id' => $booking2->id,
            'approver_id' => $approver1->id,
            'level' => 1,
            'status' => 'rejected',
            'approved_at' => now()->subDays(6),
            'notes' => 'Kendaraan perlu service terlebih dahulu',
        ]);

        BookingApproval::create([
            'booking_id' => $booking2->id,
            'approver_id' => $approver2->id,
            'level' => 2,
            'status' => 'pending',
        ]);

        // Booking 3: Approved - Mitsubishi L300 (siap digunakan)
        $booking3 = VehicleBooking::create([
            'vehicle_id' => $vehicles[1]->id, // Mitsubishi L300
            'driver_id' => $driver2->id,
            'booked_by' => $admin->id,
            'client_name' => 'Toko Serba Ada',
            'client_phone' => '083456789012',
            'start_date' => '2025-12-08 07:00:00',
            'end_date' => '2025-12-10 18:00:00',
            'purpose' => 'Distribusi barang ke toko cabang',
            'destination' => 'Bekasi, Jakarta',
            'status' => 'approved',
        ]);

        BookingApproval::create([
            'booking_id' => $booking3->id,
            'approver_id' => $approver1->id,
            'level' => 1,
            'status' => 'approved',
            'approved_at' => now()->subDays(2),
            'notes' => 'Disetujui untuk distribusi',
        ]);

        BookingApproval::create([
            'booking_id' => $booking3->id,
            'approver_id' => $approver2->id,
            'level' => 2,
            'status' => 'approved',
            'approved_at' => now()->subDays(1),
            'notes' => 'Approved',
        ]);

        // Booking 4: Pending - Toyota Hiace (menunggu approval)
        $booking4 = VehicleBooking::create([
            'vehicle_id' => $vehicles[0]->id, // Toyota Hiace
            'driver_id' => $driver1->id,
            'booked_by' => $admin->id,
            'client_name' => 'PT. Global Solutions',
            'client_phone' => '084567890123',
            'start_date' => '2025-12-15 08:00:00',
            'end_date' => '2025-12-17 17:00:00',
            'purpose' => 'Perjalanan dinas ke kantor cabang Semarang',
            'destination' => 'Semarang, Jawa Tengah',
            'status' => 'pending',
        ]);

        BookingApproval::create([
            'booking_id' => $booking4->id,
            'approver_id' => $approver1->id,
            'level' => 1,
            'status' => 'pending',
        ]);

        BookingApproval::create([
            'booking_id' => $booking4->id,
            'approver_id' => $approver2->id,
            'level' => 2,
            'status' => 'pending',
        ]);

        // Booking 5: Approved - Isuzu Elf (untuk acara besok)
        $booking5 = VehicleBooking::create([
            'vehicle_id' => $vehicles[2]->id, // Isuzu Elf
            'driver_id' => $driver1->id,
            'booked_by' => $admin->id,
            'client_name' => 'Divisi HRD',
            'client_phone' => '085678901234',
            'start_date' => '2025-12-05 06:00:00',
            'end_date' => '2025-12-07 20:00:00',
            'purpose' => 'Transportasi karyawan untuk training',
            'destination' => 'Bogor, Jawa Barat',
            'status' => 'approved',
        ]);

        BookingApproval::create([
            'booking_id' => $booking5->id,
            'approver_id' => $approver1->id,
            'level' => 1,
            'status' => 'approved',
            'approved_at' => now()->subDays(3),
            'notes' => 'Disetujui untuk training',
        ]);

        BookingApproval::create([
            'booking_id' => $booking5->id,
            'approver_id' => $approver2->id,
            'level' => 2,
            'status' => 'approved',
            'approved_at' => now()->subDays(2),
            'notes' => 'OK, silakan dilanjutkan',
        ]);

        // ========================================
        // CREATE NOTIFICATIONS FOR ALL BOOKINGS
        // ========================================
        
        // Get all admins for notifications
        $allAdmins = User::whereHas('role', function($query) {
            $query->where('name', 'admin');
        })->get();
        
        // BOOKING 1 (Completed - Toyota Avanza)
        // Notify admin: booking completed
        foreach ($allAdmins as $adminUser) {
            Notification::create([
                'user_id' => $adminUser->id,
                'type' => 'booking_completed',
                'title' => 'Pemesanan Selesai',
                'message' => "Pemesanan kendaraan Toyota Avanza telah diselesaikan.",
                'booking_id' => $booking1->id,
                'is_read' => true, // old notification
            ]);
        }
        // Notify driver
        Notification::create([
            'user_id' => $driver1->id,
            'type' => 'booking_completed',
            'title' => 'Tugas Selesai',
            'message' => "Tugas mengendarai Toyota Avanza telah selesai. Terima kasih!",
            'booking_id' => $booking1->id,
            'is_read' => true, // old notification
        ]);

        // BOOKING 2 (Rejected - Hino Dutro)
        // Notify admin: booking rejected
        foreach ($allAdmins as $adminUser) {
            Notification::create([
                'user_id' => $adminUser->id,
                'type' => 'booking_rejected',
                'title' => 'Pemesanan Ditolak',
                'message' => "Pemesanan kendaraan Hino Dutro ditolak oleh Approver 1 (Level 1). Alasan: Kendaraan perlu service terlebih dahulu",
                'booking_id' => $booking2->id,
                'is_read' => true, // old notification
            ]);
        }

        // BOOKING 3 (Approved - Mitsubishi L300)
        // Notify admin: booking approved
        foreach ($allAdmins as $adminUser) {
            Notification::create([
                'user_id' => $adminUser->id,
                'type' => 'booking_approved',
                'title' => 'Pemesanan Disetujui',
                'message' => "Pemesanan kendaraan Mitsubishi L300 telah disetujui sepenuhnya dan siap digunakan.",
                'booking_id' => $booking3->id,
                'is_read' => false,
            ]);
        }
        // Notify driver: new task
        Notification::create([
            'user_id' => $driver2->id,
            'type' => 'booking_approved',
            'title' => 'Tugas Baru',
            'message' => "Anda ditugaskan untuk mengendarai Mitsubishi L300 dari 08 Des 2025 hingga 10 Des 2025 untuk Toko Serba Ada.",
            'booking_id' => $booking3->id,
            'is_read' => false,
        ]);
        // Notify approvers: approval history
        Notification::create([
            'user_id' => $approver1->id,
            'type' => 'booking_approved',
            'title' => 'Persetujuan Diterima',
            'message' => "Persetujuan Level 1 Anda untuk pemesanan Mitsubishi L300 telah diterima.",
            'booking_id' => $booking3->id,
            'is_read' => true,
        ]);
        Notification::create([
            'user_id' => $approver2->id,
            'type' => 'booking_approved',
            'title' => 'Persetujuan Diterima',
            'message' => "Persetujuan Level 2 Anda untuk pemesanan Mitsubishi L300 telah diterima.",
            'booking_id' => $booking3->id,
            'is_read' => true,
        ]);

        // BOOKING 4 (Pending - Toyota Hiace)
        // Notify admin: booking created
        foreach ($allAdmins as $adminUser) {
            Notification::create([
                'user_id' => $adminUser->id,
                'type' => 'booking_created',
                'title' => 'Pemesanan Berhasil Dibuat',
                'message' => "Pemesanan kendaraan Toyota Hiace untuk PT. Global Solutions telah dibuat dan menunggu persetujuan.",
                'booking_id' => $booking4->id,
                'is_read' => false,
            ]);
        }
        // Notify approver 1: pending approval
        Notification::create([
            'user_id' => $approver1->id,
            'type' => 'booking_pending_approval',
            'title' => 'Persetujuan Dibutuhkan',
            'message' => "Pemesanan kendaraan Toyota Hiace memerlukan persetujuan Anda (Level 1).",
            'booking_id' => $booking4->id,
            'is_read' => false,
        ]);
        // Notify approver 2: pending approval
        Notification::create([
            'user_id' => $approver2->id,
            'type' => 'booking_pending_approval',
            'title' => 'Persetujuan Dibutuhkan',
            'message' => "Pemesanan kendaraan Toyota Hiace akan memerlukan persetujuan Anda (Level 2) setelah Level 1 disetujui.",
            'booking_id' => $booking4->id,
            'is_read' => false,
        ]);

        // BOOKING 5 (Approved - Isuzu Elf)
        // Notify admin: booking approved
        foreach ($allAdmins as $adminUser) {
            Notification::create([
                'user_id' => $adminUser->id,
                'type' => 'booking_approved',
                'title' => 'Pemesanan Disetujui',
                'message' => "Pemesanan kendaraan Isuzu Elf telah disetujui sepenuhnya dan siap digunakan.",
                'booking_id' => $booking5->id,
                'is_read' => false,
            ]);
        }
        // Notify driver: new task
        Notification::create([
            'user_id' => $driver1->id,
            'type' => 'booking_approved',
            'title' => 'Tugas Baru',
            'message' => "Anda ditugaskan untuk mengendarai Isuzu Elf dari 05 Des 2025 hingga 07 Des 2025 untuk Divisi HRD.",
            'booking_id' => $booking5->id,
            'is_read' => false,
        ]);
        // Notify approvers: approval history
        Notification::create([
            'user_id' => $approver1->id,
            'type' => 'booking_approved',
            'title' => 'Persetujuan Diterima',
            'message' => "Persetujuan Level 1 Anda untuk pemesanan Isuzu Elf telah diterima.",
            'booking_id' => $booking5->id,
            'is_read' => true,
        ]);
        Notification::create([
            'user_id' => $approver2->id,
            'type' => 'booking_approved',
            'title' => 'Persetujuan Diterima',
            'message' => "Persetujuan Level 2 Anda untuk pemesanan Isuzu Elf telah diterima.",
            'booking_id' => $booking5->id,
            'is_read' => true,
        ]);
    }
}

