<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

// Comprueba que el token JWT del header es válido
class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // TODO: validar token, devolver 401 si no es válido
        return $next($request);
    }
}