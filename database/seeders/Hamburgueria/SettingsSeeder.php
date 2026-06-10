<?php

namespace Database\Seeders\Hamburgueria;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        Setting::setGroup('appearance', [
            'primary_color' => '#D97706',
            'primary_foreground' => '#ffffff',
            'background' => '#FFFBEB',
            'foreground' => '#1C1917',
            'header_background' => '#D97706',
            'header_foreground' => '#ffffff',
            'restaurant_name' => 'Hamburgueria',
            'restaurant_whatsapp' => '',
            'menu_only' => 'false',
        ]);
    }
}
