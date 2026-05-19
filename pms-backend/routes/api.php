<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HabitacionController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\ServicioController;
use App\Http\Controllers\FacturaController;
use Illuminate\Support\Facades\Route;

// ========================================
//  RUTAS PUBLICAS (sin autenticacion)
// ========================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/habitaciones', [HabitacionController::class, 'index']);
Route::get('/habitaciones/{id}', [HabitacionController::class, 'show']);

Route::get('/servicios', [ServicioController::class, 'index']);

// ========================================
//  RUTAS PROTEGIDAS (JWT)
// ========================================
Route::middleware(['jwt.auth'])->group(function () {

    // --- Auth ---
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // --- Habitaciones (CRUD solo admin) ---
    Route::middleware('role:admin')->group(function () {
        Route::post('/habitaciones', [HabitacionController::class, 'store']);
        Route::put('/habitaciones/{id}', [HabitacionController::class, 'update']);
        Route::delete('/habitaciones/{id}', [HabitacionController::class, 'destroy']);
    });

    // --- Servicios (detalle: autenticado | CRUD: solo admin) ---
    Route::get('/servicios/{id}', [ServicioController::class, 'show']);

    Route::middleware('role:admin')->group(function () {
        Route::post('/servicios', [ServicioController::class, 'store']);
        Route::put('/servicios/{id}', [ServicioController::class, 'update']);
        Route::delete('/servicios/{id}', [ServicioController::class, 'destroy']);
    });

    // --- Reservas (todos los roles autenticados) ---
    Route::get('/reservas', [ReservaController::class, 'index']);
    Route::get('/reservas/{id}', [ReservaController::class, 'show']);
    Route::post('/reservas', [ReservaController::class, 'store']);
    Route::put('/reservas/{id}', [ReservaController::class, 'update']);
    Route::delete('/reservas/{id}', [ReservaController::class, 'destroy']);
    Route::patch('/reservas/{id}/confirmar', [ReservaController::class, 'confirmar']);
    Route::post('/reservas/{id}/pagar', [ReservaController::class, 'pagar']);
    Route::post('/reservas/{id}/servicios', [ReservaController::class, 'agregarServicios']);

    // --- Facturas ---
    Route::get('/facturas', [FacturaController::class, 'index']);
    Route::get('/facturas/{id}', [FacturaController::class, 'show']);
});
