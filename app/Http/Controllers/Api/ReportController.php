<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Exports\BookingsExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function exportBookings(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $startDate = $validated['start_date'] ?? null;
        $endDate = $validated['end_date'] ?? null;

        Log::info('Exporting bookings', ['start_date' => $startDate, 'end_date' => $endDate]);

        $filename = 'bookings_' . now()->format('Y-m-d_His') . '.xlsx';

        return Excel::download(new BookingsExport($startDate, $endDate), $filename);
    }
}
