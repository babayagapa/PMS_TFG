<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Factura;
use App\Models\Reserva;
use App\Models\Habitacion;
use App\Models\User;
use Carbon\Carbon;

class FacturaSeeder extends Seeder
{
    public function run(): void
    {
        Factura::truncate();

        $cliente = User::where('rol', 'cliente')->first();

        $reservasPagadas = Reserva::where('estado_pago', 'pagado')->get();

        $count = 0;
        foreach ($reservasPagadas as $reserva) {
            if ($count >= 10) break;

            $habitacion = Habitacion::find($reserva->id_habitacion);
            if (!$habitacion) continue;

            $noches = Carbon::parse($reserva->fecha_entrada)
                        ->diffInDays(Carbon::parse($reserva->fecha_salida));

            $subtotalHab = round($habitacion->precio_noche * $noches, 2);

            $lineas = [
                [
                    'concepto'        => "Habitacion {$habitacion->numero} ({$habitacion->tipo}) — {$noches} noche(s)",
                    'cantidad'        => $noches,
                    'precio_unitario' => $habitacion->precio_noche,
                    'subtotal'        => $subtotalHab,
                ],
            ];

            $baseImponible = $subtotalHab;
            $porcentajeIva = 10;
            $importeIva    = round($baseImponible * ($porcentajeIva / 100), 2);
            $total         = round($baseImponible + $importeIva, 2);

            $esDelCliente = $cliente && $reserva->id_cliente === (string) $cliente->_id;

            $datosCliente = [
                'nombre'   => $esDelCliente ? $cliente->nombre . ' ' . $cliente->apellidos : $reserva->nombre_huesped,
                'email'    => $esDelCliente ? $cliente->email : $reserva->email_huesped,
                'nif'      => $esDelCliente ? ($cliente->nif ?? '') : '',
                'telefono' => $esDelCliente ? ($cliente->telefono ?? '') : ($reserva->telefono_huesped ?? ''),
            ];

            Factura::create([
                'numero_factura' => sprintf('FAC-%s-%05d', date('Y'), $count + 1),
                'id_reserva'     => (string) $reserva->_id,
                'id_cliente'     => $esDelCliente ? (string) $cliente->_id : null,
                'fecha'          => Carbon::parse($reserva->fecha_entrada)->addDays($noches)->toDateTimeString(),
                'datos_cliente'  => $datosCliente,
                'datos_hotel'    => [
                    'nombre'    => Factura::HOTEL_NOMBRE,
                    'cif'       => Factura::HOTEL_CIF,
                    'direccion' => Factura::HOTEL_DIRECCION,
                    'telefono'  => Factura::HOTEL_TELEFONO,
                    'email'     => Factura::HOTEL_EMAIL,
                ],
                'lineas'         => $lineas,
                'base_imponible' => $baseImponible,
                'porcentaje_iva' => $porcentajeIva,
                'importe_iva'    => $importeIva,
                'total'          => $total,
                'metodo_pago'    => $reserva->metodo_pago ?? 'tarjeta',
            ]);

            $count++;
        }
    }
}