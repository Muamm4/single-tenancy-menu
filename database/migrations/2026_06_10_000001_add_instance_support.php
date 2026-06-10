<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This migration adds instance-aware enhancements to support
     * the white-label architecture. Each restaurant instance uses
     * its own database, so isolation is by database, not by column.
     */
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            DB::table('settings')
                ->whereIn('id', function ($query) {
                    $query->selectRaw('MIN(id)')
                          ->from('settings')
                          ->groupBy('key', 'group')
                          ->havingRaw('COUNT(*) > 1');
                })
                ->delete();

            $table->unique(['key', 'group'], 'settings_key_group_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropUnique('settings_key_group_unique');
        });
    }
};
