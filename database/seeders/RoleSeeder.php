<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'admin', 'description' => 'Administrator'],
            ['name' => 'approver_1', 'description' => 'Approver Level 1'],
            ['name' => 'approver_2', 'description' => 'Approver Level 2'],
            ['name' => 'driver', 'description' => 'Driver'],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
