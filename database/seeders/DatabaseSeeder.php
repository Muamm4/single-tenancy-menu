<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            SettingsSeeder::class,
        ]);

        $instance = config('app.instance');
        match ($instance) {
            'gameleira' => $this->call([
                Gameleira\SettingsSeeder::class,
                Gameleira\RestauranteSeeder::class,
            ]),
            'parrilla' => $this->call([
                Hamburgueria\SettingsSeeder::class,
                Hamburgueria\RestauranteSeeder::class,
            ]),
            'default' => $this->call([
                Default\SettingsSeeder::class,
                Default\RestauranteSeeder::class,
            ]),
        };
    }
}
