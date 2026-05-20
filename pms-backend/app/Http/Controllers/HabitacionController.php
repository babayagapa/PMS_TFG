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

        foreach ($habitaciones as $habitacion) {
            $this->verificarLimpiezaAutomatica($habitacion);
        }

        return response()->json($habitaciones);
    }

    // GET /api/habitaciones/{id}
    public function show(string $id)
    {
        $habitacion = Habitacion::findOrFail($id);
        $this->verificarLimpiezaAutomatica($habitacion);
        return response()->json($habitacion);
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
            'estado_limpieza', 'ocupada', 'descripcion', 'amenidades', 'fecha_limpieza'
        ]));

        return response()->json($habitacion, 201);
    }

    // PUT /api/habitaciones/{id} (solo admin)
    public function update(Request $request, string $id)
    {
        $habitacion = Habitacion::findOrFail($id);
        $habitacion->update($request->only([
            'numero', 'tipo', 'precio_noche', 'capacidad',
            'estado_limpieza', 'ocupada', 'descripcion', 'amenidades', 'fecha_limpieza'
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
        
        $updateData = ['estado_limpieza' => $request->estado_limpieza];
        if ($request->estado_limpieza === 'Limpia') {
            $updateData['fecha_limpieza'] = date('Y-m-d');
        }

        $habitacion->update($updateData);

        return response()->json($habitacion);
    }

    private function verificarLimpiezaAutomatica(Habitacion $habitacion)
    {
        $hoy = date('Y-m-d');
        
        $ultimaReservaSalida = \App\Models\Reserva::where('id_habitacion', (string)$habitacion->_id)
            ->where('estado', '!=', 'Cancelada')
            ->where('fecha_salida', '<=', $hoy)
            ->orderBy('fecha_salida', 'desc')
            ->first();

        if ($ultimaReservaSalida) {
            $fechaSalida = $ultimaReservaSalida->fecha_salida;
            $fechaLimpieza = $habitacion->fecha_limpieza;

            if ($fechaSalida === $hoy) {
                if ($habitacion->estado_limpieza !== 'Sucia' && $fechaLimpieza !== $hoy) {
                    $habitacion->update([
                        'estado_limpieza' => 'Sucia',
                    ]);
                }
            } else {
                if ($habitacion->estado_limpieza === 'Sucia') {
                    $habitacion->update([
                        'estado_limpieza' => 'Limpia',
                    ]);
                }
            }
        }
    }
}