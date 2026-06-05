<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('settings')->insert([
            'key' => 'menu_only',
            'value' => 'false',
            'group' => 'appearance',
        ]);
    }

    public function down(): void
    {
        DB::table('settings')->where('key', 'menu_only')->delete();
    }
};
