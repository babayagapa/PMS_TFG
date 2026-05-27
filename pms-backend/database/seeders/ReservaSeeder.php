<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reserva;
use App\Models\Habitacion;
use App\Models\User;
use Carbon\Carbon;

class ReservaSeeder extends Seeder
{
    public function run(): void
    {
        Reserva::truncate();

        $habitaciones = Habitacion::all();
        $cliente      = User::where('rol', 'cliente')->first();

        $huespedes = [
            ['nombre' => 'Laura Martinez',    'email' => 'laura@email.com',    'telefono' => '644444444'],
            ['nombre' => 'Pedro Sanchez',     'email' => 'pedro@email.com',    'telefono' => '622002002'],
            ['nombre' => 'Maria Lopez',       'email' => 'maria@email.com',    'telefono' => '633003003'],
            ['nombre' => 'Juan Garcia',       'email' => 'juan@email.com',     'telefono' => '644004004'],
            ['nombre' => 'Carmen Ruiz',       'email' => 'carmen@email.com',   'telefono' => '655005005'],
            ['nombre' => 'Antonio Fernandez', 'email' => 'antonio@email.com',  'telefono' => '666006006'],
            ['nombre' => 'Isabel Torres',     'email' => 'isabel@email.com',   'telefono' => '677007007'],
            ['nombre' => 'Francisco Diaz',    'email' => 'fran@email.com',     'telefono' => '688008008'],
            ['nombre' => 'Elena Moreno',      'email' => 'elena@email.com',    'telefono' => '699009009'],
            ['nombre' => 'Miguel Jimenez',    'email' => 'miguel@email.com',   'telefono' => '600010010'],
            ['nombre' => 'Sara Navarro',      'email' => 'sara@email.com',     'telefono' => '611011011'],
            ['nombre' => 'David Romero',      'email' => 'david@email.com',    'telefono' => '622012012'],
            ['nombre' => 'Lucia Ortega',      'email' => 'lucia@email.com',    'telefono' => '633013013'],
            ['nombre' => 'Pablo Herrera',     'email' => 'pablo@email.com',    'telefono' => '644014014'],
            ['nombre' => 'Marta Castillo',    'email' => 'marta@email.com',    'telefono' => '655015015'],
        ];

        $metodosPago = ['tarjeta', 'efectivo', 'transferencia'];
        $hoy = Carbon::today();
        $finMesJunio = Carbon::parse('2026-06-30'); 

        foreach ($habitaciones as $hab) {
            $fechaActual = $hoy->copy()->subDays(7);

            while ($fechaActual->lt($finMesJunio)) {
                $gap = rand(0, 3);
                $entrada = $fechaActual->copy()->addDays($gap);

                if ($entrada->gte($finMesJunio)) {
                    break;
                }

                $noches = rand(1, 5);
                $salida = $entrada->copy()->addDays($noches);

                if ($salida->gt($finMesJunio)) {
                    $salida = $finMesJunio->copy();
                    $noches = $entrada->diffInDays($salida);
                }

                if ($noches < 1) {
                    break;
                }

                $huesped = $huespedes[array_rand($huespedes)];
                $esCliente = rand(1, 100) <= 20; 

                if ($esCliente && $cliente) {
                    $nombreHuesped = trim($cliente->nombre . ' ' . $cliente->apellidos);
                    $emailHuesped = $cliente->email;
                    $telefonoHuesped = $cliente->telefono;
                } else {
                    $nombreHuesped = $huesped['nombre'];
                    $emailHuesped = $huesped['email'];
                    $telefonoHuesped = $huesped['telefono'];
                }

                if ($entrada->lte($hoy)) {
                    $estado     = 'Confirmada';
                    $estadoPago = 'pagado';
                } else {
                    $estado = rand(1, 100) <= 35 ? 'Pendiente' : 'Confirmada'; 
                    
                    if ($estado === 'Pendiente') {
                        $estadoPago = 'pendiente';
                    } else {
                        $estadoPago = collect(['pagado', 'pendiente'])->random();
                    }
                }

                $precioHab  = round($hab->precio_noche * $noches, 2);
                $baseImp    = $precioHab;
                $pctIva     = 10;
                $importeIva = round($baseImp * ($pctIva / 100), 2);
                $total      = round($baseImp + $importeIva, 2);

                Reserva::create([
                    'id_cliente'        => ($esCliente && $cliente) ? $cliente->_id : null,
                    'id_habitacion'     => $hab->_id,
                    'nombre_huesped'    => $nombreHuesped,
                    'email_huesped'     => $emailHuesped,
                    'telefono_huesped'  => $telefonoHuesped,
                    'fecha_entrada'     => $entrada->toDateString(),
                    'fecha_salida'      => $salida->toDateString(),
                    'num_huespedes'     => rand(1, $hab->capacidad),
                    'notas'             => '',
                    'servicios_pedidos' => [],
                    'precio_habitacion' => $precioHab,
                    'precio_servicios'  => 0,
                    'base_imponible'    => $baseImp,
                    'porcentaje_iva'    => $pctIva,
                    'importe_iva'       => $importeIva,
                    'precio_total'      => $total,
                    'estado'            => $estado,
                    'metodo_pago'       => $estadoPago === 'pagado' ? $metodosPago[array_rand($metodosPago)] : null,
                    'estado_pago'       => $estadoPago,
                    'pagado_en'         => $estadoPago === 'pagado' ? now() : null,
                ]);

                $fechaActual = $salida->copy();
            }
        }
    }
}