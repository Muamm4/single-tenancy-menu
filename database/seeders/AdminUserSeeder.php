<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\User::firstOrCreate(
            ['email' => 'admin@cardapio.com'],
            [
                'name' => 'Administrador',
                'email_verified_at' => now(),
                'password' => bcrypt('admin123'),
                'is_admin' => true,
            ]
        );
    }
}
