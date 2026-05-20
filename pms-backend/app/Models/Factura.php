<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Factura extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'facturas';

    const HOTEL_NOMBRE    = 'Hotel PMS Resort & Spa';
    const HOTEL_CIF       = 'B12345678';
    const HOTEL_DIRECCION = 'Calle Principal 1, 28001 Madrid, Espana';
    const HOTEL_TELEFONO  = '+34 912 345 678';
    const HOTEL_EMAIL     = 'facturacion@hotelpms.com';

    protected $fillable = [
        'numero_factura',
        'id_reserva',
        'id_cliente',
        'fecha',
        'datos_cliente',
        'datos_hotel',
        'lineas',
        'base_imponible',
        'porcentaje_iva',
        'importe_iva',
        'total',
        'metodo_pago',
    ];

    protected $casts = [
        'datos_cliente'  => 'array',
        'datos_hotel'    => 'array',
        'lineas'         => 'array',
        'base_imponible' => 'float',
        'porcentaje_iva' => 'float',
        'importe_iva'    => 'float',
        'total'          => 'float',
    ];

    // Genera numero de factura auto-incremental: FAC-2026-00001
    public static function generarNumero(): string
    {
        $anio  = date('Y');
        $count = self::where('numero_factura', 'like', "FAC-{$anio}-%")->count();
        return sprintf('FAC-%s-%05d', $anio, $count + 1);
    }

    // Crea una factura a partir de una reserva pagada
    public static function crearDesdeReserva(Reserva $reserva, User $cliente, string $metodoPago): self
    {
        $lineas     = [];
        $habitacion = Habitacion::find($reserva->id_habitacion);
        $noches     = \Carbon\Carbon::parse($reserva->fecha_entrada)
                        ->diffInDays(\Carbon\Carbon::parse($reserva->fecha_salida));

        $subtotalHab = round($habitacion->precio_noche * $noches, 2);

        $lineas[] = [
            'concepto'        => "Habitacion {$habitacion->numero} ({$habitacion->tipo}) — {$noches} noche(s)",
            'cantidad'        => $noches,
            'precio_unitario' => $habitacion->precio_noche,
            'subtotal'        => $subtotalHab,
        ];

        $subtotalServicios = 0;
        if (!empty($reserva->servicios_pedidos)) {
            foreach ($reserva->servicios_pedidos as $sp) {
                $sub = round($sp['precio'] * $sp['cantidad'], 2);
                $subtotalServicios += $sub;
                $lineas[] = [
                    'concepto'        => $sp['nombre'],
                    'cantidad'        => $sp['cantidad'],
                    'precio_unitario' => $sp['precio'],
                    'subtotal'        => $sub,
                ];
            }
        }

        $baseImponible = round($subtotalHab + $subtotalServicios, 2);
        $porcentajeIva = 10;
        $importeIva    = round($baseImponible * ($porcentajeIva / 100), 2);
        $total         = round($baseImponible + $importeIva, 2);

        return self::create([
            'numero_factura' => self::generarNumero(),
            'id_reserva'     => (string) $reserva->_id,
            'id_cliente'     => (string) $cliente->_id,
            'fecha'          => now()->toDateTimeString(),
            'datos_cliente'  => [
                'nombre'   => $cliente->nombre,
                'email'    => $cliente->email,
                'nif'      => $cliente->nif ?? '',
                'telefono' => $cliente->telefono ?? '',
            ],
            'datos_hotel' => [
                'nombre'    => self::HOTEL_NOMBRE,
                'cif'       => self::HOTEL_CIF,
                'direccion' => self::HOTEL_DIRECCION,
                'telefono'  => self::HOTEL_TELEFONO,
                'email'     => self::HOTEL_EMAIL,
            ],
            'lineas'         => $lineas,
            'base_imponible' => $baseImponible,
            'porcentaje_iva' => $porcentajeIva,
            'importe_iva'    => $importeIva,
            'total'          => $total,
            'metodo_pago'    => $metodoPago,
        ]);
    }

    public function reserva()
    {
        return $this->belongsTo(Reserva::class, 'id_reserva');
    }

    public function cliente()
    {
        return $this->belongsTo(User::class, 'id_cliente');
    }
}