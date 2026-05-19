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
        $clientes     = User::where('rol', 'cliente')->get();

        // Si no hay clientes en el seeder, usar IDs ficticios
        $nombresHuesped = [
            ['nombre' => 'Laura Martinez',   'email' => 'laura@email.com',   'telefono' => '+34 611 001 001'],
            ['nombre' => 'Pedro Sanchez',    'email' => 'pedro@email.com',   'telefono' => '+34 622 002 002'],
            ['nombre' => 'Maria Lopez',      'email' => 'maria@email.com',   'telefono' => '+34 633 003 003'],
            ['nombre' => 'Juan Garcia',      'email' => 'juan@email.com',    'telefono' => '+34 644 004 004'],
            ['nombre' => 'Carmen Ruiz',      'email' => 'carmen@email.com',  'telefono' => '+34 655 005 005'],
            ['nombre' => 'Antonio Fernandez','email' => 'antonio@email.com', 'telefono' => '+34 666 006 006'],
            ['nombre' => 'Isabel Torres',    'email' => 'isabel@email.com',  'telefono' => '+34 677 007 007'],
            ['nombre' => 'Francisco Diaz',   'email' => 'fran@email.com',    'telefono' => '+34 688 008 008'],
            ['nombre' => 'Elena Moreno',     'email' => 'elena@email.com',   'telefono' => '+34 699 009 009'],
            ['nombre' => 'Miguel Jimenez',   'email' => 'miguel@email.com',  'telefono' => '+34 600 010 010'],
        ];

        $estados      = ['Pendiente', 'Confirmada', 'Confirmada', 'Pendiente', 'Cancelada'];
        $estadosPago  = ['pendiente', 'pagado', 'pagado', 'pendiente', 'pendiente'];
        $metodosPago  = ['tarjeta', 'efectivo', 'transferencia'];

        $hoy = Carbon::today();

        for ($i = 0; $i < 20; $i++) {
            $hab      = $habitaciones[$i % $habitaciones->count()];
            $huesped  = $nombresHuesped[$i % count($nombresHuesped)];
            $entrada  = $hoy->copy()->addDays(rand(0, 25));
            $salida   = $entrada->copy()->addDays(rand(1, 5));
            $noches   = $entrada->diffInDays($salida);
            $estado   = $estados[$i % count($estados)];
            $estPago  = $estadosPago[$i % count($estadosPago)];

            $precioHab  = round($hab->precio_noche * $noches, 2);
            $baseImp    = $precioHab;
            $pctIva     = 10;
            $importeIva = round($baseImp * ($pctIva / 100), 2);
            $total      = round($baseImp + $importeIva, 2);

            Reserva::create([
                'id_cliente'        => $clientes->isNotEmpty() ? $clientes->random()->_id : null,
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
                'estado'            => $estado,
                'metodo_pago'       => $estPago === 'pagado' ? $metodosPago[array_rand($metodosPago)] : null,
                'estado_pago'       => $estPago,
                'pagado_en'         => $estPago === 'pagado' ? now() : null,
            ]);
        }
    }
}
