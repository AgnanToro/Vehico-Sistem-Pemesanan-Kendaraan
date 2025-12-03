<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'office_id', 'name', 'license_plate', 'type', 'ownership',
        'fuel_consumption', 'odometer', 'last_service_date', 'next_service_date', 
        'service_interval_km', 'status'
    ];

    protected $casts = [
        'fuel_consumption' => 'decimal:2',
        'odometer' => 'integer',
        'service_interval_km' => 'integer',
        'last_service_date' => 'date:Y-m-d',
        'next_service_date' => 'date:Y-m-d',
    ];

    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function bookings()
    {
        return $this->hasMany(VehicleBooking::class);
    }

    public function logs()
    {
        return $this->hasMany(VehicleLog::class);
    }
}
