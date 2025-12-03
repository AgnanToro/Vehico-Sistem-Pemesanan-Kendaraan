<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleLog extends Model
{
    protected $fillable = [
        'vehicle_id', 'booking_id', 'type', 'fuel_amount', 'odometer', 
        'odometer_start', 'odometer_end', 'distance', 'notes'
    ];

    protected $casts = [
        'fuel_amount' => 'decimal:2',
        'odometer' => 'decimal:2',
        'odometer_start' => 'integer',
        'odometer_end' => 'integer',
        'distance' => 'integer',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function booking()
    {
        return $this->belongsTo(VehicleBooking::class, 'booking_id');
    }
}
