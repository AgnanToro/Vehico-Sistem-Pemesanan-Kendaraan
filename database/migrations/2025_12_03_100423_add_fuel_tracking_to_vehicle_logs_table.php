<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vehicle_logs', function (Blueprint $table) {
            $table->integer('odometer_start')->nullable()->after('odometer')->comment('KM awal');
            $table->integer('odometer_end')->nullable()->after('odometer_start')->comment('KM akhir');
            $table->integer('distance')->nullable()->after('odometer_end')->comment('Total KM');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicle_logs', function (Blueprint $table) {
            $table->dropColumn(['odometer_start', 'odometer_end', 'distance']);
        });
    }
};
