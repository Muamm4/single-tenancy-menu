<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general');
            $table->timestamps();
        });

        // Insert default color settings
        DB::table('settings')->insert([
            ['key' => 'primary_color', 'value' => '#fc5d5dff', 'group' => 'appearance'],
            ['key' => 'primary_foreground', 'value' => '#000000', 'group' => 'appearance'],
            ['key' => 'background', 'value' => '#FBF9F5', 'group' => 'appearance'],
            ['key' => 'foreground', 'value' => '#1E221F', 'group' => 'appearance'],
            ['key' => 'header_background', 'value' => '#000000', 'group' => 'appearance'],
            ['key' => 'header_foreground', 'value' => '#f2f2f2ff', 'group' => 'appearance'],
            ['key' => 'restaurant_name', 'value' => 'Menu Digital', 'group' => 'appearance'],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
