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

        return response()->json($query->orderBy('numero')->get());
    }

    // GET /api/habitaciones/{id}
    public function show(string $id)
    {
        return response()->json(Habitacion::findOrFail($id));
    }

    // POST /api/habitaciones (solo admin)
    public function store(Request $request)
    {
        $request->validate([
            'numero'       => 'required|string',
            'tipo'         => 'required|string',
            'precio_noche' => 'required|numeric|min:0',
            'capacidad'    => 'required|integer|min:1',
        ]);

        $habitacion = Habitacion::create($request->only([
            'numero', 'tipo', 'precio_noche', 'capacidad',
            'estado_limpieza', 'ocupada', 'descripcion', 'amenidades',
        ]));

        return response()->json($habitacion, 201);
    }

    // PUT /api/habitaciones/{id} (solo admin)
    public function update(Request $request, string $id)
    {
        $habitacion = Habitacion::findOrFail($id);
        $habitacion->update($request->only([
            'numero', 'tipo', 'precio_noche', 'capacidad',
            'estado_limpieza', 'ocupada', 'descripcion', 'amenidades',
        ]));

        return response()->json($habitacion);
    }

    // DELETE /api/habitaciones/{id} (solo admin)
    public function destroy(string $id)
    {
        Habitacion::findOrFail($id)->delete();

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