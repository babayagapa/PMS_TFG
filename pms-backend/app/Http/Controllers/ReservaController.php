<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\Habitacion;
use App\Models\Servicio;
use App\Models\Factura;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservaController extends Controller
{
    public function index(Request $request)
    {
        $user  = Auth::guard('api')->user();
        $query = Reserva::with('habitacion');

        if ($user->rol === 'cliente') {
            $query->where('id_cliente', (string) $user->_id);
        }

        if ($request->has('estado')) {
            $query->where('estado', $request->estado);
        }

        $reservas = $query->orderBy('created_at', 'desc')->get();

        return response()->json($reservas);
    }

    public function show(string $id)
    {
        $user    = Auth::guard('api')->user();
        $reserva = Reserva::findOrFail($id);

        if ($user->rol === 'cliente' && $reserva->id_cliente !== (string) $user->_id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        return response()->json($reserva);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_habitacion'            => 'required|string',
            'nombre_huesped'           => 'required|string',
            'email_huesped'            => 'required|email',
            'telefono_huesped'         => 'required|string',
            'fecha_entrada'            => 'required|date',
            'fecha_salida'             => 'required|date|after:fecha_entrada',
            'num_huespedes'            => 'required|integer|min:1',
            'servicios_pedidos'        => 'nullable|array',
            'servicios_pedidos.*.id_servicio' => 'required_with:servicios_pedidos|string',
            'servicios_pedidos.*.cantidad'    => 'required_with:servicios_pedidos|integer|min:1',
        ]);

        $habitacion = Habitacion::findOrFail($request->id_habitacion);

        $overlap = Reserva::where('id_habitacion', $request->id_habitacion)
            ->where('estado', '!=', 'Cancelada')
            ->where('fecha_entrada', '<', $request->fecha_salida)
            ->where('fecha_salida', '>', $request->fecha_entrada)
            ->exists();

        if ($overlap) {
            return response()->json(['error' => 'La habitacion ya tiene una reserva en esas fechas'], 422);
        }

        $serviciosPedidos = [];
        if ($request->has('servicios_pedidos') && is_array($request->servicios_pedidos)) {
            foreach ($request->servicios_pedidos as $sp) {
                $servicio = Servicio::find($sp['id_servicio']);
                if (!$servicio || !$servicio->disponible) {
                    return response()->json([
                        'error' => "Servicio no disponible: {$sp['id_servicio']}",
                    ], 422);
                }

                $serviciosPedidos[] = [
                    'id_servicio' => (string) $servicio->_id,
                    'nombre'      => $servicio->nombre,
                    'precio'      => $servicio->precio,
                    'cantidad'    => $sp['cantidad'],
                ];
            }
        }

        $desglose = Reserva::calcularDesglose(
            $habitacion->precio_noche,
            $request->fecha_entrada,
            $request->fecha_salida,
            $serviciosPedidos
        );

        $reserva = Reserva::create([
            'id_cliente'        => (string) Auth::id(),
            'id_habitacion'     => $request->id_habitacion,
            'nombre_huesped'    => $request->nombre_huesped,
            'email_huesped'     => $request->email_huesped,
            'telefono_huesped'  => $request->telefono_huesped,
            'fecha_entrada'     => $request->fecha_entrada,
            'fecha_salida'      => $request->fecha_salida,
            'num_huespedes'     => $request->num_huespedes,
            'notas'             => $request->notas ?? '',
            'servicios_pedidos' => $serviciosPedidos,
            'precio_habitacion' => $desglose['precio_habitacion'],
            'precio_servicios'  => $desglose['precio_servicios'],
            'base_imponible'    => $desglose['base_imponible'],
            'porcentaje_iva'    => $desglose['porcentaje_iva'],
            'importe_iva'       => $desglose['importe_iva'],
            'precio_total'      => $desglose['precio_total'],
            'estado'            => 'Confirmada',
            'estado_pago'       => 'pendiente',
            'metodo_pago'       => null,
            'pagado_en'         => null,
        ]);

        $habitacion->update(['ocupada' => true]);

        return response()->json($reserva, 201);
    }

    public function update(Request $request, string $id)
    {
        $reserva = Reserva::findOrFail($id);

        $reserva->update($request->only([
            'nombre_huesped',
            'email_huesped',
            'telefono_huesped',
            'notas',
        ]));

        return response()->json($reserva);
    }

    public function destroy(string $id)
    {
        $reserva = Reserva::findOrFail($id);
        $reserva->update(['estado' => 'Cancelada']);

        $habitacion = Habitacion::find($reserva->id_habitacion);
        if ($habitacion) {
            $habitacion->update([
                'ocupada'         => false,
                'estado_limpieza' => 'Sucia',
            ]);
        }

        return response()->json(['message' => 'Reserva cancelada']);
    }

    public function confirmar(string $id)
    {
        $reserva = Reserva::findOrFail($id);

        if ($reserva->estado !== 'Pendiente') {
            return response()->json(['error' => 'Solo se pueden confirmar reservas pendientes'], 422);
        }

        $reserva->update(['estado' => 'Confirmada']);

        return response()->json($reserva);
    }

    public function pagar(Request $request, string $id)
    {
        $request->validate([
            'metodo_pago' => 'required|string|in:tarjeta,efectivo,transferencia',
        ]);

        $user    = Auth::guard('api')->user();
        $reserva = Reserva::findOrFail($id);

        if ($user->rol === 'cliente' && $reserva->id_cliente !== (string) $user->_id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        if ($reserva->estado_pago === 'pagado') {
            return response()->json(['error' => 'Esta reserva ya esta pagada'], 422);
        }

        if ($reserva->estado === 'Cancelada') {
            return response()->json(['error' => 'No se puede pagar una reserva cancelada'], 422);
        }

        $reserva->update([
            'metodo_pago' => $request->metodo_pago,
            'estado_pago' => 'pagado',
            'pagado_en'   => now()->toDateTimeString(),
            'estado'      => 'Confirmada',
        ]);

        $cliente = User::find($reserva->id_cliente);
        $factura = Factura::crearDesdeReserva($reserva, $cliente, $request->metodo_pago);

        return response()->json([
            'message' => 'Pago realizado con exito',
            'reserva' => $reserva->fresh(),
            'factura' => $factura,
        ]);
    }

    public function agregarServicios(Request $request, string $id)
    {
        $request->validate([
            'servicios'            => 'required|array|min:1',
            'servicios.*.id_servicio' => 'required|string',
            'servicios.*.cantidad'    => 'required|integer|min:1',
        ]);

        $user    = Auth::guard('api')->user();
        $reserva = Reserva::findOrFail($id);

        if ($user->rol === 'cliente' && $reserva->id_cliente !== (string) $user->_id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        if ($reserva->estado_pago === 'pagado') {
            return response()->json(['error' => 'No se pueden agregar servicios a una reserva ya pagada'], 422);
        }

        $serviciosActuales = $reserva->servicios_pedidos ?? [];

        foreach ($request->servicios as $sp) {
            $servicio = Servicio::find($sp['id_servicio']);
            if (!$servicio || !$servicio->disponible) {
                return response()->json([
                    'error' => "Servicio no disponible: {$sp['id_servicio']}",
                ], 422);
            }

            $serviciosActuales[] = [
                'id_servicio' => (string) $servicio->_id,
                'nombre'      => $servicio->nombre,
                'precio'      => $servicio->precio,
                'cantidad'    => $sp['cantidad'],
            ];
        }

        $habitacion = Habitacion::findOrFail($reserva->id_habitacion);
        $desglose   = Reserva::calcularDesglose(
            $habitacion->precio_noche,
            $reserva->fecha_entrada,
            $reserva->fecha_salida,
            $serviciosActuales
        );

        $reserva->update([
            'servicios_pedidos' => $serviciosActuales,
            'precio_habitacion' => $desglose['precio_habitacion'],
            'precio_servicios'  => $desglose['precio_servicios'],
            'base_imponible'    => $desglose['base_imponible'],
            'porcentaje_iva'    => $desglose['porcentaje_iva'],
            'importe_iva'       => $desglose['importe_iva'],
            'precio_total'      => $desglose['precio_total'],
        ]);

        return response()->json($reserva->fresh());
    }
}