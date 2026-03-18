<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Controlador de Reservas (Reservations)
 *
 * Gestiona el CRUD de reservas.
 * - Clientes sólo ven/crean sus propias reservas.
 * - Recepcionistas y Administradores tienen acceso completo.
 */
class ReservationController extends Controller
{
    /**
     * Lista reservas.
     *
     * GET /api/reservations
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Reservation::with(['cliente', 'habitacion']);

        // Los Clientes sólo ven sus propias reservas
        if ($user->hasRol(User::ROL_CLIENTE)) {
            $query->where('cliente_id', $user->id);
        }

        return response()->json($query->get());
    }

    /**
     * Crea una nueva reserva.
     *
     * POST /api/reservations
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'cliente_id'    => ['required', 'string'],
            'habitacion_id' => ['required', 'string'],
            'fecha_entrada' => ['required', 'date', 'after_or_equal:today'],
            'fecha_salida'  => ['required', 'date', 'after:fecha_entrada'],
            'estado'        => ['sometimes', Rule::in(Reservation::ESTADOS)],
        ]);

        // Calcular precio total automáticamente
        $room = Room::findOrFail($data['habitacion_id']);
        $nights = (int) (new \DateTime($data['fecha_entrada']))->diff(new \DateTime($data['fecha_salida']))->days;
        $data['precio_total'] = $room->precio_noche * $nights;
        $data['estado']       = $data['estado'] ?? Reservation::ESTADO_CONFIRMADA;

        $reservation = Reservation::create($data);

        return response()->json($reservation->load(['cliente', 'habitacion']), 201);
    }

    /**
     * Muestra una reserva específica.
     *
     * GET /api/reservations/{id}
     */
    public function show(Reservation $reservation): JsonResponse
    {
        return response()->json($reservation->load(['cliente', 'habitacion']));
    }

    /**
     * Actualiza una reserva.
     *
     * PUT /api/reservations/{id}
     */
    public function update(Request $request, Reservation $reservation): JsonResponse
    {
        $data = $request->validate([
            'fecha_entrada' => ['sometimes', 'date'],
            'fecha_salida'  => ['sometimes', 'date', 'after:fecha_entrada'],
            'estado'        => ['sometimes', Rule::in(Reservation::ESTADOS)],
        ]);

        $reservation->update($data);

        return response()->json($reservation->load(['cliente', 'habitacion']));
    }

    /**
     * Cancela/elimina una reserva.
     *
     * DELETE /api/reservations/{id}
     */
    public function destroy(Reservation $reservation): JsonResponse
    {
        $reservation->update(['estado' => Reservation::ESTADO_CANCELADA]);

        return response()->json(['message' => 'Reserva cancelada correctamente.']);
    }
}
