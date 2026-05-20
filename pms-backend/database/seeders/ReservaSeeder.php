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

        $habOcupada = [];

        $plantillas = [
            ['hab' => 0, 'huesped' => 0,  'noches' => 3, 'estado' => 'Confirmada', 'pago' => 'pagado',    'esCliente' => true,  'inicio' => -10],
            ['hab' => 0, 'huesped' => 1,  'noches' => 2, 'estado' => 'Confirmada', 'pago' => 'pagado',    'esCliente' => false, 'inicio' => null],
            ['hab' => 0, 'huesped' => 2,  'noches' => 4, 'estado' => 'Confirmada', 'pago' => 'pendiente', 'esCliente' => false, 'inicio' => null],
            ['hab' => 0, 'huesped' => 3,  'noches' => 3, 'estado' => 'Pendiente',  'pago' => 'pendiente', 'esCliente' => false, 'inicio' => null],
            ['hab' => 1, 'huesped' => 4,  'noches' => 2, 'estado' => 'Confirmada', 'pago' => 'pagado',    'esCliente' => false, 'inicio' => -5],
            ['hab' => 1, 'huesped' => 5,  'noches' => 3, 'estado' => 'Confirmada', 'pago' => 'pendiente', 'esCliente' => false, 'inicio' => null],
            ['hab' => 1, 'huesped' => 6,  'noches' => 2, 'estado' => 'Pendiente',  'pago' => 'pendiente', 'esCliente' => false, 'inicio' => null],
            ['hab' => 2, 'huesped' => 7,  'noches' => 4, 'estado' => 'Confirmada', 'pago' => 'pagado',    'esCliente' => false, 'inicio' => -8],
            ['hab' => 2, 'huesped' => 8,  'noches' => 2, 'estado' => 'Confirmada', 'pago' => 'pendiente', 'esCliente' => false, 'inicio' => null],
            ['hab' => 2, 'huesped' => 9,  'noches' => 3, 'estado' => 'Confirmada', 'pago' => 'pagado',    'esCliente' => false, 'inicio' => null],
            ['hab' => 3, 'huesped' => 10, 'noches' => 3, 'estado' => 'Confirmada', 'pago' => 'pendiente', 'esCliente' => false, 'inicio' => 0],
            ['hab' => 3, 'huesped' => 11, 'noches' => 4, 'estado' => 'Pendiente',  'pago' => 'pendiente', 'esCliente' => false, 'inicio' => null],
            ['hab' => 4, 'huesped' => 0,  'noches' => 3, 'estado' => 'Confirmada', 'pago' => 'pagado',    'esCliente' => true,  'inicio' => -6],
            ['hab' => 4, 'huesped' => 12, 'noches' => 2, 'estado' => 'Confirmada', 'pago' => 'pagado',    'esCliente' => false, 'inicio' => null],
            ['hab' => 4, 'huesped' => 13, 'noches' => 5, 'estado' => 'Confirmada', 'pago' => 'pendiente', 'esCliente' => false, 'inicio' => null],
            ['hab' => 4, 'huesped' => 14, 'noches' => 2, 'estado' => 'Pendiente',  'pago' => 'pendiente', 'esCliente' => false, 'inicio' => null],
            ['hab' => 5, 'huesped' => 1,  'noches' => 4, 'estado' => 'Confirmada', 'pago' => 'pagado',    'esCliente' => false, 'inicio' => -4],
            ['hab' => 5, 'huesped' => 3,  'noches' => 3, 'estado' => 'Confirmada', 'pago' => 'pendiente', 'esCliente' => false, 'inicio' => null],
            ['hab' => 5, 'huesped' => 5,  'noches' => 2, 'estado' => 'Pendiente',  'pago' => 'pendiente', 'esCliente' => false, 'inicio' => null],
            ['hab' => 6, 'huesped' => 7,  'noches' => 3, 'estado' => 'Confirmada', 'pago' => 'pagado',    'esCliente' => false, 'inicio' => -3],
            ['hab' => 6, 'huesped' => 9,  'noches' => 4, 'estado' => 'Confirmada', 'pago' => 'pendiente', 'esCliente' => false, 'inicio' => null],
            ['hab' => 6, 'huesped' => 11, 'noches' => 3, 'estado' => 'Confirmada', 'pago' => 'pagado',    'esCliente' => false, 'inicio' => null],
            ['hab' => 7, 'huesped' => 2,  'noches' => 5, 'estado' => 'Confirmada', 'pago' => 'pendiente', 'esCliente' => false, 'inicio' => 1],
            ['hab' => 7, 'huesped' => 4,  'noches' => 3, 'estado' => 'Pendiente',  'pago' => 'pendiente', 'esCliente' => false, 'inicio' => null],
            ['hab' => 8, 'huesped' => 6,  'noches' => 3, 'estado' => 'Confirmada', 'pago' => 'pagado',    'esCliente' => false, 'inicio' => -7],
            ['hab' => 8, 'huesped' => 8,  'noches' => 4, 'estado' => 'Confirmada', 'pago' => 'pagado',    'esCliente' => false, 'inicio' => null],
            ['hab' => 8, 'huesped' => 10, 'noches' => 3, 'estado' => 'Confirmada', 'pago' => 'pendiente', 'esCliente' => false, 'inicio' => null],
            ['hab' => 9, 'huesped' => 12, 'noches' => 5, 'estado' => 'Confirmada', 'pago' => 'pendiente', 'esCliente' => false, 'inicio' => -2],
            ['hab' => 9, 'huesped' => 14, 'noches' => 4, 'estado' => 'Pendiente',  'pago' => 'pendiente', 'esCliente' => false, 'inicio' => null],
            ['hab' => 10, 'huesped' => 1,  'noches' => 4, 'estado' => 'Confirmada', 'pago' => 'pagado',   'esCliente' => false, 'inicio' => -9],
            ['hab' => 10, 'huesped' => 3,  'noches' => 3, 'estado' => 'Confirmada', 'pago' => 'pendiente','esCliente' => false, 'inicio' => null],
            ['hab' => 10, 'huesped' => 5,  'noches' => 5, 'estado' => 'Confirmada', 'pago' => 'pagado',   'esCliente' => false, 'inicio' => null],
            ['hab' => 11, 'huesped' => 13, 'noches' => 3, 'estado' => 'Confirmada', 'pago' => 'pagado',   'esCliente' => false, 'inicio' => -4],
            ['hab' => 11, 'huesped' => 7,  'noches' => 4, 'estado' => 'Confirmada', 'pago' => 'pendiente','esCliente' => false, 'inicio' => null],
            ['hab' => 11, 'huesped' => 9,  'noches' => 2, 'estado' => 'Pendiente',  'pago' => 'pendiente','esCliente' => false, 'inicio' => null],
        ];

        foreach ($plantillas as $p) {
            $hab     = $habitaciones[$p['hab']];
            $huesped = $huespedes[$p['huesped']];
            $habKey  = $p['hab'];

            if ($p['inicio'] !== null) {
                $entrada = $hoy->copy()->addDays($p['inicio']);
                $habOcupada[$habKey] = $entrada->copy(); 
            } else {
                $entrada = $habOcupada[$habKey]->copy();
            }

            $salida = $entrada->copy()->addDays($p['noches']);
            $habOcupada[$habKey] = $salida->copy();

            $precioHab  = round($hab->precio_noche * $p['noches'], 2);
            $baseImp    = $precioHab;
            $pctIva     = 10;
            $importeIva = round($baseImp * ($pctIva / 100), 2);
            $total      = round($baseImp + $importeIva, 2);

            Reserva::create([
                'id_cliente'        => ($p['esCliente'] && $cliente) ? $cliente->_id : null,
                'id_habitacion'     => $hab->_id,
                'nombre_huesped'    => $huesped['nombre'],
                'email_huesped'     => $huesped['email'],
                'telefono_huesped'  => $huesped['telefono'],
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
                'estado'            => $p['estado'],
                'metodo_pago'       => $p['pago'] === 'pagado' ? $metodosPago[array_rand($metodosPago)] : null,
                'estado_pago'       => $p['pago'],
                'pagado_en'         => $p['pago'] === 'pagado' ? now() : null,
            ]);
        }
    }
}