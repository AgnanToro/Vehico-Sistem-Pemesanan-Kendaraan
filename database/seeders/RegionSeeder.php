<?php

namespace Database\Seeders;

use App\Models\Region;
use Illuminate\Database\Seeder;

class RegionSeeder extends Seeder
{
    public function run(): void
    {
        $regions = [
            ['name' => 'Sulawesi', 'address' => 'Sulawesi Region'],
            ['name' => 'Kalimantan', 'address' => 'Kalimantan Region'],
            ['name' => 'Maluku', 'address' => 'Maluku Region'],
        ];

        foreach ($regions as $region) {
            Region::create($region);
        }
    }
}
