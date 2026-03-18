<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Controlador de Habitaciones (Rooms)
 *
 * Gestiona el CRUD de habitaciones y la actualización de estado de limpieza.
 */
class RoomController extends Controller
{
    /**
     * Lista todas las habitaciones.
     *
     * GET /api/rooms
     */
    public function index(): JsonResponse
    {
        $rooms = Room::all();
        return response()->json($rooms);
    }

    /**
     * Crea una nueva habitación.
     *
     * POST /api/rooms
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'numero'           => ['required', 'integer', Rule::unique('rooms', 'numero')],
            'tipo'             => ['required', Rule::in(Room::TIPOS)],
            'precio_noche'     => ['required', 'numeric', 'min:0'],
            'estado_limpieza'  => ['sometimes', Rule::in(Room::ESTADOS_LIMPIEZA)],
            'estado_ocupacion' => ['sometimes', Rule::in(Room::ESTADOS_OCUPACION)],
        ]);

        $data['estado_limpieza']  = $data['estado_limpieza']  ?? Room::LIMPIEZA_LIMPIA;
        $data['estado_ocupacion'] = $data['estado_ocupacion'] ?? Room::OCUPACION_LIBRE;

        $room = Room::create($data);

        return response()->json($room, 201);
    }

    /**
     * Muestra una habitación específica.
     *
     * GET /api/rooms/{id}
     */
    public function show(Room $room): JsonResponse
    {
        return response()->json($room);
    }

    /**
     * Actualiza una habitación.
     *
     * PUT /api/rooms/{id}
     */
    public function update(Request $request, Room $room): JsonResponse
    {
        $data = $request->validate([
            'numero'           => ['sometimes', 'integer', Rule::unique('rooms', 'numero')->ignore($room->id, '_id')],
            'tipo'             => ['sometimes', Rule::in(Room::TIPOS)],
            'precio_noche'     => ['sometimes', 'numeric', 'min:0'],
            'estado_limpieza'  => ['sometimes', Rule::in(Room::ESTADOS_LIMPIEZA)],
            'estado_ocupacion' => ['sometimes', Rule::in(Room::ESTADOS_OCUPACION)],
        ]);

        $room->update($data);

        return response()->json($room);
    }

    /**
     * Elimina una habitación.
     *
     * DELETE /api/rooms/{id}
     */
    public function destroy(Room $room): JsonResponse
    {
        $room->delete();
        return response()->json(['message' => 'Habitación eliminada correctamente.']);
    }

    /**
     * Actualiza únicamente el estado de limpieza de una habitación.
     * Endpoint dedicado para el rol Limpieza.
     *
     * PATCH /api/rooms/{id}/limpieza
     */
    public function updateLimpieza(Request $request, Room $room): JsonResponse
    {
        $data = $request->validate([
            'estado_limpieza' => ['required', Rule::in(Room::ESTADOS_LIMPIEZA)],
        ]);

        $room->update($data);

        return response()->json($room);
    }
}
