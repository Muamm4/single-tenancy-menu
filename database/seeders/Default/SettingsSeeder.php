<?php

namespace Database\Seeders\Default;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        Setting::setGroup('appearance', [
            'primary_color' => '#2563EB',
            'primary_foreground' => '#ffffff',
            'background' => '#ffffff',
            'foreground' => '#0F172A',
            'header_background' => '#2563EB',
            'header_foreground' => '#ffffff',
            'restaurant_name' => 'Cardápio Digital',
            'restaurant_whatsapp' => '',
            'menu_only' => 'false',
        ]);
    }
}
