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
            ['email' => 'admin@iitism.ac.in'],
            [
                'name' => 'CDC Admin',
                'password' => 'password123',
                'role' => 'admin',
                'company_id' => null,
            ]
        );
    }
}
