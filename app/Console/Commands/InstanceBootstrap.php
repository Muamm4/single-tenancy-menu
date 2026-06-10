<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class InstanceBootstrap extends Command
{
    protected $signature = 'instance:bootstrap
                            {name : Instance name (e.g., gameleira, hamburgueria)}
                            {--domain= : Production domain}
                            {--whatsapp= : Restaurant WhatsApp number}
                            {--force : Overwrite existing files}';

    protected $description = 'Bootstrap a new restaurant instance';

    public function handle(): int
    {
        $name = Str::slug($this->argument('name'));
        $domain = $this->option('domain') ?? $name . '.localhost';
        $whatsapp = $this->option('whatsapp') ?? '';

        $this->components->info("Bootstrapping instance: {$name}");

        $logoPath = public_path("logos/{$name}");
        if (!File::exists($logoPath)) {
            File::makeDirectory("{$logoPath}/icons", 0755, true);
            File::copy(public_path('logos/default/favicon.svg'), "{$logoPath}/favicon.svg");
            $this->components->info("Created logo directory: {$logoPath}");
        } else {
            $this->components->warn("Logo directory already exists: {$logoPath}");
        }

        $envPath = base_path('.env');
        if (!File::exists($envPath)) {
            File::copy(base_path('.env.example'), $envPath);
            $this->components->info('Created .env from .env.example');
        } else {
            $this->components->warn('.env already exists, skipping');
        }

        $this->updateEnvVariable('APP_INSTANCE', $name);
        $this->updateEnvVariable('APP_NAME', Str::title($name));
        $this->updateEnvVariable('APP_SHORT_NAME', Str::title($name));
        $this->updateEnvVariable('APP_LOGO_PATH', "logos/{$name}");
        $this->updateEnvVariable('APP_URL', "https://{$domain}");
        if ($whatsapp) {
            $this->updateEnvVariable('APP_WHATSAPP', $whatsapp);
        }

        $this->call('key:generate', ['--force' => true]);
        $this->call('migrate', ['--force' => true]);
        $this->call('db:seed', ['--force' => true]);

        $this->components->success("Instance '{$name}' bootstrapped!");
        $this->newLine();
        $this->line('Next steps:');
        $this->line('  1. Update .env with your database credentials');
        $this->line('  2. Configure your web server (nginx/Caddy)');
        $this->line('  3. Run: php artisan serve');
        $this->line('  4. Login at /admin with admin@cardapio.com / admin123');

        return Command::SUCCESS;
    }

    private function updateEnvVariable(string $key, string $value): void
    {
        $envPath = base_path('.env');
        $content = File::get($envPath);

        if (Str::contains($content, "{$key}=")) {
            $content = preg_replace("/^{$key}=.*/m", "{$key}={$value}", $content);
        } else {
            $content .= "\n{$key}={$value}";
        }

        File::put($envPath, $content);
    }
}
