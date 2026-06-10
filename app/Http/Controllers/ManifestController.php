<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class ManifestController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $logoPath = config('app.logo_path');

        return response()->json([
            'name' => config('app.name'),
            'short_name' => config('app.short_name'),
            'start_url' => '/',
            'display' => 'standalone',
            'background_color' => '#ffffff',
            'theme_color' => config('app.theme_color'),
            'icons' => [
                [
                    'src' => asset("{$logoPath}/icons/icon-128x128.png"),
                    'sizes' => '128x128',
                    'type' => 'image/png',
                ],
                [
                    'src' => asset("{$logoPath}/icons/icon-192x192.png"),
                    'sizes' => '192x192',
                    'type' => 'image/png',
                ],
                [
                    'src' => asset("{$logoPath}/icons/icon-512x512.png"),
                    'sizes' => '512x512',
                    'type' => 'image/png',
                    'purpose' => 'any maskable',
                ],
            ],
        ]);
    }
}
