<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = [
            [
                'office_id' => 1, 
                'name' => 'Toyota Hiace', 
                'license_plate' => 'B1234ABC', 
                'type' => 'angkutan_orang', 
                'ownership' => 'milik_perusahaan', 
                'fuel_consumption' => 10.5,
                'odometer' => 45000,
                'last_service_date' => '2025-11-20',
                'next_service_date' => '2026-02-20',
                'service_interval_km' => 5000,
                'status' => 'tersedia'
            ],
            [
                'office_id' => 1, 
                'name' => 'Mitsubishi L300', 
                'license_plate' => 'B5678DEF', 
                'type' => 'angkutan_barang', 
                'ownership' => 'milik_perusahaan', 
                'fuel_consumption' => 12.0,
                'odometer' => 49500, // 500 km until service
                'last_service_date' => '2025-11-05',
                'next_service_date' => '2025-12-08', // 5 days from now - URGENT!
                'service_interval_km' => 5000,
                'status' => 'digunakan' // Sedang digunakan untuk booking approved
            ],
            [
                'office_id' => 2, 
                'name' => 'Isuzu Elf', 
                'license_plate' => 'DD1111GHI', 
                'type' => 'angkutan_barang', 
                'ownership' => 'sewa', 
                'fuel_consumption' => 8.5,
                'odometer' => 59700, // 300 km until service - URGENT!
                'last_service_date' => '2025-10-15',
                'next_service_date' => '2026-01-15',
                'service_interval_km' => 10000,
                'status' => 'digunakan' // Sedang digunakan untuk booking approved
            ],
            [
                'office_id' => 3, 
                'name' => 'Toyota Avanza', 
                'license_plate' => 'DN2222JKL', 
                'type' => 'angkutan_orang', 
                'ownership' => 'milik_perusahaan', 
                'fuel_consumption' => 14.0,
                'odometer' => 28000,
                'last_service_date' => '2025-11-25',
                'next_service_date' => '2026-02-25',
                'service_interval_km' => 5000,
                'status' => 'tersedia'
            ],
            [
                'office_id' => 3, 
                'name' => 'Mitsubishi Fuso', 
                'license_plate' => 'DN3333MNO', 
                'type' => 'angkutan_barang', 
                'ownership' => 'milik_perusahaan', 
                'fuel_consumption' => 6.5,
                'odometer' => 65000,
                'last_service_date' => '2025-09-20',
                'next_service_date' => '2025-12-05', // 2 days from now - URGENT!
                'service_interval_km' => 10000,
                'status' => 'tersedia'
            ],
            [
                'office_id' => 4, 
                'name' => 'Hino Dutro', 
                'license_plate' => 'DN4444PQR', 
                'type' => 'angkutan_barang', 
                'ownership' => 'sewa', 
                'fuel_consumption' => 7.0,
                'odometer' => 44800, // 200 km until service - URGENT!
                'last_service_date' => '2025-11-01',
                'next_service_date' => '2025-12-10', // 7 days from now - URGENT!
                'service_interval_km' => 5000,
                'status' => 'tersedia'
            ],
        ];

        foreach ($vehicles as $vehicle) {
            Vehicle::create($vehicle);
        }
    }
}
