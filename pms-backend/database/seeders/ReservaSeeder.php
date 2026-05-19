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

        // Nombres ficticios para reservas sin usuario registrado
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

        // Definir 40 reservas distribuidas en el tiempo
        // Mezcla de pasadas, presentes y futuras para que se vea bien en el calendario
        $reservasDef = [];

        // --- 8 reservas ya pasadas (hace 1-3 semanas), todas pagadas ---
        for ($i = 0; $i < 8; $i++) {
            $entrada = $hoy->copy()->subDays(rand(7, 21));
            $noches  = rand(2, 4);
            $reservasDef[] = [
                'hab_idx'   => $i % $habitaciones->count(),
                'huesped'   => $huespedes[$i % count($huespedes)],
                'entrada'   => $entrada,
                'noches'    => $noches,
                'estado'    => 'Confirmada',
                'pago'      => 'pagado',
                'esCliente' => ($i === 0), // La primera reserva pasada es de Laura (cliente)
            ];
        }

        // --- 10 reservas actuales (check-in entre -2 y +3 dias), variedad de estados ---
        for ($i = 0; $i < 10; $i++) {
            $entrada = $hoy->copy()->addDays(rand(-2, 3));
            $noches  = rand(2, 5);
            $estados = ['Confirmada', 'Confirmada', 'Pendiente', 'Confirmada', 'Confirmada'];
            $pagos   = ['pagado', 'pendiente', 'pendiente', 'pagado', 'pendiente'];
            $reservasDef[] = [
                'hab_idx'   => ($i + 8) % $habitaciones->count(),
                'huesped'   => $huespedes[($i + 8) % count($huespedes)],
                'entrada'   => $entrada,
                'noches'    => $noches,
                'estado'    => $estados[$i % count($estados)],
                'pago'      => $pagos[$i % count($pagos)],
                'esCliente' => ($i === 0), // Una reserva actual de Laura
            ];
        }

        // --- 12 reservas futuras (1-4 semanas), variedad ---
        for ($i = 0; $i < 12; $i++) {
            $entrada = $hoy->copy()->addDays(rand(4, 28));
            $noches  = rand(1, 5);
            $estados = ['Confirmada', 'Pendiente', 'Confirmada', 'Pendiente'];
            $pagos   = ['pendiente', 'pendiente', 'pagado', 'pendiente'];
            $reservasDef[] = [
                'hab_idx'   => ($i + 4) % $habitaciones->count(),
                'huesped'   => $huespedes[($i + 3) % count($huespedes)],
                'entrada'   => $entrada,
                'noches'    => $noches,
                'estado'    => $estados[$i % count($estados)],
                'pago'      => $pagos[$i % count($pagos)],
                'esCliente' => false,
            ];
        }

        // --- 10 reservas más repartidas para dar densidad ---
        for ($i = 0; $i < 10; $i++) {
            $entrada = $hoy->copy()->addDays(rand(-5, 20));
            $noches  = rand(1, 4);
            $estadoRand = rand(0, 2);
            $estado = $estadoRand === 0 ? 'Pendiente' : 'Confirmada';
            $pago   = $estadoRand === 2 ? 'pagado' : 'pendiente';
            $reservasDef[] = [
                'hab_idx'   => ($i + 2) % $habitaciones->count(),
                'huesped'   => $huespedes[($i + 5) % count($huespedes)],
                'entrada'   => $entrada,
                'noches'    => $noches,
                'estado'    => $estado,
                'pago'      => $pago,
                'esCliente' => false,
            ];
        }

        // Crear las reservas
        foreach ($reservasDef as $def) {
            $hab     = $habitaciones[$def['hab_idx']];
            $huesped = $def['huesped'];
            $entrada = $def['entrada'];
            $salida  = $entrada->copy()->addDays($def['noches']);
            $noches  = $def['noches'];

            $precioHab  = round($hab->precio_noche * $noches, 2);
            $baseImp    = $precioHab;
            $pctIva     = 10;
            $importeIva = round($baseImp * ($pctIva / 100), 2);
            $total      = round($baseImp + $importeIva, 2);

            Reserva::create([
                'id_cliente'        => ($def['esCliente'] && $cliente) ? $cliente->_id : null,
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
                'estado'            => $def['estado'],
                'metodo_pago'       => $def['pago'] === 'pagado' ? $metodosPago[array_rand($metodosPago)] : null,
                'estado_pago'       => $def['pago'],
                'pagado_en'         => $def['pago'] === 'pagado' ? now() : null,
            ]);
        }
    }
}
