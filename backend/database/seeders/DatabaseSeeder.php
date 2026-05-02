<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@wellnessconnect.local',
                'password' => 'Admin@12345',
                'role' => 'admin',
            ],
            [
                'name' => 'Client User',
                'email' => 'client@wellnessconnect.local',
                'password' => 'Client@12345',
                'role' => 'client',
            ],
            [
                'name' => 'Counsellor User',
                'email' => 'counsellor@wellnessconnect.local',
                'password' => 'Counsellor@12345',
                'role' => 'counsellor',
            ],
        ];

        foreach ($users as $payload) {
            User::updateOrCreate(
                ['email' => $payload['email']],
                [
                    'name' => $payload['name'],
                    'password' => $payload['password'],
                    'role' => $payload['role'],
                ]
            );
        }
    }
}
