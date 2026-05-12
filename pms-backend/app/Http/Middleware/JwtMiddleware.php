<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

// Comprueba que el token JWT del header es vÃ¡lido
class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // TODO: validar token, devolver 401 si no es vÃ¡lido
        return $next($request);
    }
}