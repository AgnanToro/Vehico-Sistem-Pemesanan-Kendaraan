<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsDriver
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated and has driver role
        if (!$request->user() || $request->user()->role->name !== 'driver') {
            return response()->json([
                'message' => 'Tidak diizinkan. Hanya Driver yang dapat menyelesaikan pemesanan.'
            ], 403);
        }

        return $next($request);
    }
}
