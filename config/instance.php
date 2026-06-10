<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Instance Configuration
    |--------------------------------------------------------------------------
    |
    | These values identify which restaurant instance is running.
    | Each deployment (Gameleira, Hamburgueria, etc) has its own .env
    | with a unique APP_INSTANCE value. Everything else derives from it.
    |
    */

    'instance' => env('APP_INSTANCE', 'default'),

    'short_name' => env('APP_SHORT_NAME', 'Cardápio'),

    'logo_path' => env('APP_LOGO_PATH', 'logos/default'),

    'theme_color' => env('APP_THEME_COLOR', '#3B82F6'),

    'whatsapp' => env('APP_WHATSAPP', ''),

    'cache_prefix' => env('CACHE_PREFIX', 'cardapio_'),
];
