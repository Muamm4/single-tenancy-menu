<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="manifest" href="/manifest.json">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg?v={{ filemtime(public_path('favicon.svg')) }}">
    <meta name="theme-color" content="{{ App\Models\Setting::getValue('primary_color', '#2C402E') }}">
    <link rel="apple-touch-icon" href="/icons/icon-128x128.png">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">

    @php
        $primary = App\Models\Setting::getValue('primary_color', '#ef4444');
        $primaryFg = App\Models\Setting::getValue('primary_foreground', '#ffffff');
        $background = App\Models\Setting::getValue('background', '#ffffff');
        $foreground = App\Models\Setting::getValue('foreground', '#1b1b18');
        $headerBg = App\Models\Setting::getValue('header_background', '#ef4444');
        $headerFg = App\Models\Setting::getValue('header_foreground', '#ffffff');
    @endphp

    <style>
        :root {
            background-color: {{ $background }};
            --safe-top: env(safe-area-inset-top, 0px);
            --safe-bottom: env(safe-area-inset-bottom, 0px);
            --primary: {{ $primary }};
            --primary-foreground: {{ $primaryFg }};
            --background: {{ $background }};
            --foreground: {{ $foreground }};
            --header-background: {{ $headerBg }};
            --header-foreground: {{ $headerFg }};
            --header-color: {{ $headerFg }};
            --card: {{ $background }};
            --card-foreground: {{ $foreground }};
            --popover: {{ $background }};
            --popover-foreground: {{ $foreground }};
            --secondary: oklch(0.97 0 0);
            --secondary-foreground: {{ $foreground }};
            --muted: oklch(0.97 0 0);
            --muted-foreground: oklch(0.556 0 0);
            --accent: oklch(0.97 0 0);
            --accent-foreground: {{ $foreground }};
            --border: oklch(0.922 0 0);
            --input: oklch(0.922 0 0);
            --ring: {{ $primary }};
            --radius: 0.625rem;
            --sidebar: {{ $background }};
            --sidebar-foreground: {{ $foreground }};
            --sidebar-primary: {{ $primary }};
            --sidebar-primary-foreground: {{ $primaryFg }};
            --sidebar-accent: oklch(0.97 0 0);
            --sidebar-accent-foreground: {{ $foreground }};
            --sidebar-border: oklch(0.922 0 0);
            --sidebar-ring: {{ $primary }};
        }
    </style>

    <title data-inertia>{{ config('app.name', 'Cardapio') }}</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

    <body class="font-sans antialiased">
        @inertia
        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js?v={{ filemtime(public_path('sw.js')) }}')
                        .then(reg => {
                            console.log('SW registered!', reg);

                            // Check for SW updates on every page load
                            reg.update();

                            // Auto-reload when a new SW takes over
                            let refreshing = false;
                            navigator.serviceWorker.addEventListener('controllerchange', () => {
                                if (refreshing) return;
                                refreshing = true;
                                window.location.reload();
                            });
                        })
                        .catch(err => console.log('SW registration failed:', err));
                });
            }
        </script>
    </body>

</html>
