<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = Auth::guard('api')->user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        if (!in_array($user->rol, $roles)) {
            return response()->json([
                'error' => 'No tienes permisos para realizar esta accion',
            ], 403);
        }

        return $next($request);
    }
}