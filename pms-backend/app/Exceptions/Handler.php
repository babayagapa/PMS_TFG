<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = ['password', 'password_confirmation'];

    public function register(): void {}

    public function render($request, Throwable $e)
    {
        if ($request->is('api/*')) {
            if ($e instanceof ValidationException) {
                return response()->json([
                    'error'   => 'Datos invalidos',
                    'errores' => $e->errors(),
                ], 422);
            }
            if ($e instanceof ModelNotFoundException) {
                return response()->json(['error' => 'No encontrado'], 404);
            }
            if ($e instanceof AuthenticationException) {
                return response()->json(['error' => 'No autenticado'], 401);
            }
            return response()->json(['error' => 'Error del servidor'], 500);
        }
        return parent::render($request, $e);
    }
}
