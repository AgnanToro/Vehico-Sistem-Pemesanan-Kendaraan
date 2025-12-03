<?php

namespace Database\Seeders;

use App\Models\Office;
use Illuminate\Database\Seeder;

class OfficeSeeder extends Seeder
{
    public function run(): void
    {
        $offices = [
            ['region_id' => 1, 'name' => 'Kantor Pusat', 'type' => 'pusat', 'address' => 'Jakarta'],
            ['region_id' => 1, 'name' => 'Kantor Cabang Makassar', 'type' => 'cabang', 'address' => 'Makassar'],
            ['region_id' => 1, 'name' => 'Tambang Morowali', 'type' => 'tambang', 'address' => 'Morowali, Sulawesi Tengah'],
            ['region_id' => 1, 'name' => 'Tambang Kolaka', 'type' => 'tambang', 'address' => 'Kolaka, Sulawesi Tenggara'],
            ['region_id' => 2, 'name' => 'Tambang Konawe', 'type' => 'tambang', 'address' => 'Konawe, Sulawesi Tenggara'],
            ['region_id' => 2, 'name' => 'Tambang Bombana', 'type' => 'tambang', 'address' => 'Bombana, Sulawesi Tenggara'],
            ['region_id' => 3, 'name' => 'Tambang Weda Bay', 'type' => 'tambang', 'address' => 'Halmahera Tengah'],
            ['region_id' => 3, 'name' => 'Tambang Pomalaa', 'type' => 'tambang', 'address' => 'Kolaka, Sulawesi Tenggara'],
        ];

        foreach ($offices as $office) {
            Office::create($office);
        }
    }
}
