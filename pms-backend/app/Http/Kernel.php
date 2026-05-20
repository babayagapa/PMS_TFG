<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    // Middleware que se ejecuta en todas las peticiones
    protected $middleware = [
        \Illuminate\Http\Middleware\HandleCors::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \Illuminate\Foundation\Http\Middleware\TrimStrings::class,
    ];

    // Grupos de middleware por tipo de ruta
    protected $middlewareGroups = [
        'web' => [],
        'api' => [
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    // Alias para usar en rutas con ->middleware('nombre')
    protected $middlewareAliases = [
        'auth'     => \Illuminate\Auth\Middleware\Authenticate::class,
        'jwt.auth' => \App\Http\Middleware\JwtMiddleware::class,
        'role'     => \App\Http\Middleware\CheckRole::class,
    ];
}