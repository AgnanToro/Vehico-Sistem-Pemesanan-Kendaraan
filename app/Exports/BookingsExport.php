<?php

namespace App\Exports;

use App\Models\VehicleBooking;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class BookingsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate = null, $endDate = null)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function collection()
    {
        $query = VehicleBooking::with(['vehicle', 'driver', 'bookedBy']);

        if ($this->startDate && $this->endDate) {
            $query->whereBetween('created_at', [$this->startDate, $this->endDate]);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Vehicle',
            'License Plate',
            'Driver',
            'Booked By',
            'Start Date',
            'End Date',
            'Purpose',
            'Destination',
            'Status',
            'Created At',
        ];
    }

    public function map($booking): array
    {
        return [
            $booking->id,
            $booking->vehicle->name,
            $booking->vehicle->license_plate,
            $booking->driver->name,
            $booking->bookedBy->name,
            $booking->start_date,
            $booking->end_date,
            $booking->purpose,
            $booking->destination,
            $booking->status,
            $booking->created_at,
        ];
    }
}
