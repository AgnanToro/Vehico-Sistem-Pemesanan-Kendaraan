<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated and has admin role
        if (!$request->user() || $request->user()->role->name !== 'admin') {
            return response()->json([
                'message' => 'Tidak diizinkan. Hanya Admin yang dapat melakukan aksi ini.'
            ], 403);
        }

        return $next($request);
    }
}
