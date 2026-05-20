<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Habitacion;

class HabitacionSeeder extends Seeder
{
    public function run(): void
    {
        Habitacion::truncate();

        $habitaciones = [
            [
                'numero'          => '101',
                'tipo'            => 'Individual',
                'precio_noche'    => 65,
                'capacidad'       => 1,
                'ocupada'         => false,
                'estado_limpieza' => 'Limpia',
                'descripcion'     => 'Habitacion individual con vistas al jardin.',
                'amenidades'      => ['WiFi', 'TV', 'Aire acondicionado'],
            ],
            [
                'numero'          => '102',
                'tipo'            => 'Individual',
                'precio_noche'    => 65,
                'capacidad'       => 1,
                'ocupada'         => false,
                'estado_limpieza' => 'Limpia',
                'descripcion'     => 'Habitacion individual luminosa en planta baja.',
                'amenidades'      => ['WiFi', 'TV'],
            ],
            [
                'numero'          => '103',
                'tipo'            => 'Individual',
                'precio_noche'    => 65,
                'capacidad'       => 1,
                'ocupada'         => false,
                'estado_limpieza' => 'Limpia',
                'descripcion'     => 'Habitacion individual con escritorio de trabajo.',
                'amenidades'      => ['WiFi', 'TV', 'Aire acondicionado'],
            ],
            [
                'numero'          => '104',
                'tipo'            => 'Individual',
                'precio_noche'    => 65,
                'capacidad'       => 1,
                'ocupada'         => false,
                'estado_limpieza' => 'Limpia',
                'descripcion'     => 'Habitacion individual en proceso de renovacion.',
                'amenidades'      => ['WiFi', 'TV'],
            ],
            [
                'numero'          => '201',
                'tipo'            => 'Doble',
                'precio_noche'    => 95,
                'capacidad'       => 2,
                'ocupada'         => false,
                'estado_limpieza' => 'Limpia',
                'descripcion'     => 'Habitacion doble con cama de matrimonio y terraza.',
                'amenidades'      => ['WiFi', 'TV', 'Aire acondicionado', 'Minibar'],
            ],
            [
                'numero'          => '202',
                'tipo'            => 'Doble',
                'precio_noche'    => 95,
                'capacidad'       => 2,
                'ocupada'         => false,
                'estado_limpieza' => 'Limpia',
                'descripcion'     => 'Habitacion doble con dos camas individuales.',
                'amenidades'      => ['WiFi', 'TV', 'Aire acondicionado'],
            ],
            [
                'numero'          => '203',
                'tipo'            => 'Doble',
                'precio_noche'    => 95,
                'capacidad'       => 2,
                'ocupada'         => false,
                'estado_limpieza' => 'Limpia',
                'descripcion'     => 'Habitacion doble con jacuzzi privado.',
                'amenidades'      => ['WiFi', 'TV', 'Aire acondicionado', 'Jacuzzi'],
            ],
            [
                'numero'          => '204',
                'tipo'            => 'Doble',
                'precio_noche'    => 95,
                'capacidad'       => 2,
                'ocupada'         => false,
                'estado_limpieza' => 'Limpia',
                'descripcion'     => 'Habitacion doble con vistas a la piscina.',
                'amenidades'      => ['WiFi', 'TV', 'Aire acondicionado', 'Minibar'],
            ],
            [
                'numero'          => '301',
                'tipo'            => 'Suite',
                'precio_noche'    => 180,
                'capacidad'       => 2,
                'ocupada'         => false,
                'estado_limpieza' => 'Limpia',
                'descripcion'     => 'Suite de lujo con salon privado y terraza panoramica.',
                'amenidades'      => ['WiFi', 'TV 4K', 'Aire acondicionado', 'Jacuzzi', 'Minibar', 'Terraza'],
            ],
            [
                'numero'          => '302',
                'tipo'            => 'Suite',
                'precio_noche'    => 180,
                'capacidad'       => 2,
                'ocupada'         => false,
                'estado_limpieza' => 'Limpia',
                'descripcion'     => 'Suite con banera exenta y vistas al mar.',
                'amenidades'      => ['WiFi', 'TV 4K', 'Aire acondicionado', 'Jacuzzi', 'Minibar'],
            ],
            [
                'numero'          => '401',
                'tipo'            => 'Familiar',
                'precio_noche'    => 145,
                'capacidad'       => 4,
                'ocupada'         => false,
                'estado_limpieza' => 'Limpia',
                'descripcion'     => 'Habitacion familiar con zona de estar y litera infantil.',
                'amenidades'      => ['WiFi', 'TV', 'Aire acondicionado', 'Microondas', 'Nevera'],
            ],
            [
                'numero'          => '402',
                'tipo'            => 'Familiar',
                'precio_noche'    => 145,
                'capacidad'       => 4,
                'ocupada'         => false,
                'estado_limpieza' => 'Limpia',
                'descripcion'     => 'Habitacion familiar amplia, ideal para grupos.',
                'amenidades'      => ['WiFi', 'TV', 'Aire acondicionado', 'Microondas'],
            ],
        ];

        foreach ($habitaciones as $datos) {
            Habitacion::create($datos);
        }
    }
}