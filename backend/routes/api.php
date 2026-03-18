<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes – PMS Hotel
|--------------------------------------------------------------------------
| All routes are prefixed with /api automatically by Laravel.
| Protected routes require a valid Sanctum token.
|--------------------------------------------------------------------------
*/

// ── Public endpoints ─────────────────────────────────────────────────────────
Route::post('/auth/login',    [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']); // Only used by admins in prod

// ── Authenticated endpoints ───────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // ── Rooms ─────────────────────────────────────────────────────────────────
    // GET    /api/rooms           → list all rooms (Receptionist, Admin)
    // POST   /api/rooms           → create room (Admin only)
    // GET    /api/rooms/{id}      → show room
    // PUT    /api/rooms/{id}      → update room (Admin, Receptionist)
    // DELETE /api/rooms/{id}      → delete room (Admin only)
    // PATCH  /api/rooms/{id}/limpieza → update cleaning status (Limpieza, Admin)
    Route::apiResource('rooms', RoomController::class);
    Route::patch('rooms/{room}/limpieza', [RoomController::class, 'updateLimpieza']);

    // ── Reservations ──────────────────────────────────────────────────────────
    // GET    /api/reservations         → list (Admin/Receptionist: all; Cliente: own)
    // POST   /api/reservations         → create (Receptionist, Cliente)
    // GET    /api/reservations/{id}    → show
    // PUT    /api/reservations/{id}    → update (Receptionist, Admin)
    // DELETE /api/reservations/{id}    → cancel (Receptionist, Admin)
    Route::apiResource('reservations', ReservationController::class);

    // ── Users (Admin only) ────────────────────────────────────────────────────
    Route::apiResource('users', UserController::class);
});
