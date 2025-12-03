<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'role_id' => 1,
                'office_id' => 1,
                'name' => 'Admin',
                'email' => 'admin@sekawan.com',
                'phone' => '081234567890',
                'password' => Hash::make('password'),
            ],
            [
                'role_id' => 2,
                'office_id' => 1,
                'name' => 'Manager Operasional',
                'email' => 'approver1@sekawan.com',
                'phone' => '081234567891',
                'password' => Hash::make('password'),
            ],
            [
                'role_id' => 3,
                'office_id' => 1,
                'name' => 'Direktur',
                'email' => 'approver2@sekawan.com',
                'phone' => '081234567892',
                'password' => Hash::make('password'),
            ],
            [
                'role_id' => 4,
                'office_id' => 1,
                'name' => 'Driver 1',
                'email' => 'driver1@sekawan.com',
                'phone' => '081234567893',
                'password' => Hash::make('password'),
            ],
            [
                'role_id' => 4,
                'office_id' => 2,
                'name' => 'Driver 2',
                'email' => 'driver2@sekawan.com',
                'phone' => '081234567894',
                'password' => Hash::make('password'),
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
