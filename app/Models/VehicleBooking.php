<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleBooking extends Model
{
    protected $fillable = [
        'vehicle_id', 'driver_id', 'booked_by', 'client_name', 'client_phone',
        'start_date', 'end_date', 'purpose', 'destination', 'status'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function bookedBy()
    {
        return $this->belongsTo(User::class, 'booked_by');
    }

    public function approvals()
    {
        return $this->hasMany(BookingApproval::class, 'booking_id');
    }

    public function logs()
    {
        return $this->hasMany(VehicleLog::class, 'booking_id');
    }
}
