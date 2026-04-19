<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'iitismcdc@gmail.com'],
            [
                'name' => 'CDC Admin',
                'password' => 'Admin@123',
                'role' => 'admin',
                'company_id' => null,
            ]
        );
    }
}
