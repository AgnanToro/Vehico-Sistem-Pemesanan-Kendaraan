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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('office_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('license_plate')->unique();
            $table->enum('type', ['angkutan_orang', 'angkutan_barang']);
            $table->enum('ownership', ['milik_perusahaan', 'sewa']);
            $table->decimal('fuel_consumption', 8, 2)->default(0)->comment('Liter per 100 KM');
            $table->integer('odometer')->default(0)->comment('Total KM');
            $table->date('last_service_date')->nullable();
            $table->date('next_service_date')->nullable();
            $table->integer('service_interval_km')->default(5000)->comment('Service setiap X KM');
            $table->enum('status', ['tersedia', 'digunakan', 'maintenance'])->default('tersedia');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
