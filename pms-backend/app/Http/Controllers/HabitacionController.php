<?php

namespace App\Http\Controllers;

use App\Models\Habitacion;
use Illuminate\Http\Request;

class HabitacionController extends Controller
{
    // GET /api/habitaciones
    public function index(Request $request)
    {
        $query = Habitacion::query();

        if ($request->has('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        if ($request->has('ocupada')) {
            $query->where('ocupada', $request->boolean('ocupada'));
        }

        $habitaciones = $query->orderBy('numero')->get();

        return response()->json($habitaciones);
    }

    // GET /api/habitaciones/{id}
    public function show(string $id)
    {
        $habitacion = Habitacion::findOrFail($id);

        return response()->json($habitacion);
    }

    // POST /api/habitaciones
    public function store(Request $request)
    {
        $request->validate([
            'numero'       => 'required|string',
            'tipo'         => 'required|string',
            'precio_noche' => 'required|numeric|min:0',
            'capacidad'    => 'required|integer|min:1',
        ]);

        $habitacion = Habitacion::create($request->all());

        return response()->json($habitacion, 201);
    }

    // PUT /api/habitaciones/{id}
    public function update(Request $request, string $id)
    {
        $habitacion = Habitacion::findOrFail($id);
        $habitacion->update($request->all());

        return response()->json($habitacion);
    }

    // DELETE /api/habitaciones/{id}
    public function destroy(string $id)
    {
        $habitacion = Habitacion::findOrFail($id);
        $habitacion->delete();

        return response()->json(['message' => 'Habitacion eliminada']);
    }

    // PATCH /api/habitaciones/{id}/limpieza (admin + limpieza)
    public function cambiarLimpieza(Request $request, string $id)
    {
        $request->validate([
            'estado_limpieza' => 'required|string|in:Limpia,Sucia',
        ]);

        $habitacion = Habitacion::findOrFail($id);
        $habitacion->update(['estado_limpieza' => $request->estado_limpieza]);

        return response()->json($habitacion);
    }
}