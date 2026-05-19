<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Carbon\Carbon;

class Reserva extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'reservas';

    protected $fillable = [
        'id_cliente',
        'id_habitacion',
        'nombre_huesped',
        'email_huesped',
        'telefono_huesped',
        'fecha_entrada',
        'fecha_salida',
        'num_huespedes',
        'notas',
        'servicios_pedidos',
        'precio_habitacion',
        'precio_servicios',
        'base_imponible',
        'porcentaje_iva',
        'importe_iva',
        'precio_total',
        'estado',
        'metodo_pago',
        'estado_pago',
        'pagado_en',
    ];

    protected $casts = [
        'precio_habitacion' => 'float',
        'precio_servicios'  => 'float',
        'base_imponible'    => 'float',
        'porcentaje_iva'    => 'float',
        'importe_iva'       => 'float',
        'precio_total'      => 'float',
        'num_huespedes'     => 'integer',
        'servicios_pedidos' => 'array',
    ];

    /**
     * Calcula el desglose completo de precios (habitacion + servicios + IVA).
     */
    public static function calcularDesglose(
        float $precioNoche,
        string $entrada,
        string $salida,
        array $servicios = []
    ): array {
        $noches = Carbon::parse($entrada)->diffInDays(Carbon::parse($salida));
        if ($noches <= 0) $noches = 1;

        $precioHabitacion = round($precioNoche * $noches, 2);

        $precioServicios = 0;
        foreach ($servicios as $s) {
            $precioServicios += round(($s['precio'] ?? 0) * ($s['cantidad'] ?? 1), 2);
        }
        $precioServicios = round($precioServicios, 2);

        $baseImponible = round($precioHabitacion + $precioServicios, 2);
        $porcentajeIva = 10;
        $importeIva    = round($baseImponible * ($porcentajeIva / 100), 2);
        $precioTotal   = round($baseImponible + $importeIva, 2);

        return [
            'precio_habitacion' => $precioHabitacion,
            'precio_servicios'  => $precioServicios,
            'base_imponible'    => $baseImponible,
            'porcentaje_iva'    => $porcentajeIva,
            'importe_iva'       => $importeIva,
            'precio_total'      => $precioTotal,
        ];
    }

    // --- Relaciones ---

    public function habitacion()
    {
        return $this->belongsTo(Habitacion::class, 'id_habitacion');
    }

    public function cliente()
    {
        return $this->belongsTo(User::class, 'id_cliente');
    }

    public function factura()
    {
        return $this->hasOne(Factura::class, 'id_reserva');
    }
}
