<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        Setting::setGroup('appearance', [
            'primary_color' => '#2C402E',
            'primary_foreground' => '#ffffff',
            'background' => '#FBF9F5',
            'foreground' => '#1E221F',
            'header_background' => '#2C402E',
            'header_foreground' => '#ffffff',
            'restaurant_name' => 'Gameleira Esfiharia & Bistrô',
            'restaurant_whatsapp' => '',
            'menu_only' => 'false',
        ]);
    }
}
