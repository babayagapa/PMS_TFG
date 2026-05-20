<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = ['password', 'password_confirmation'];

    public function render($request, Throwable $e)
    {
        if ($request->is('api/*') || $request->expectsJson()) {
            if ($e instanceof ValidationException) {
                return response()->json([
                    'error'   => 'Datos invalidos',
                    'errores' => $e->errors(),
                ], 422);
            }

            if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
                return response()->json(['error' => 'No encontrado'], 404);
            }

            if ($e instanceof AuthenticationException) {
                return response()->json(['error' => 'No autenticado'], 401);
            }

            if ($e instanceof MethodNotAllowedHttpException) {
                return response()->json(['error' => 'Metodo no permitido'], 405);
            }

            return response()->json([
                'error'   => 'Error del servidor',
                'detalle' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }

        return parent::render($request, $e);
    }
}