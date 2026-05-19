<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Servicio;

class ServicioSeeder extends Seeder
{
    public function run(): void
    {
        Servicio::truncate();

        $servicios = [
            [
                'nombre'      => 'Desayuno buffet',
                'descripcion' => 'Desayuno buffet completo con opciones internacionales, zumos naturales y reposteria artesanal.',
                'precio'      => 18.00,
                'categoria'   => 'Restauracion',
                'disponible'  => true,
            ],
            [
                'nombre'      => 'Cena especial',
                'descripcion' => 'Cena gourmet de tres platos con maridaje de vinos seleccionados.',
                'precio'      => 45.00,
                'categoria'   => 'Restauracion',
                'disponible'  => true,
            ],
            [
                'nombre'      => 'Servicio de spa',
                'descripcion' => 'Acceso completo al spa con piscina climatizada, sauna y jacuzzi durante todo el dia.',
                'precio'      => 35.00,
                'categoria'   => 'Bienestar',
                'disponible'  => true,
            ],
            [
                'nombre'      => 'Masaje relajante',
                'descripcion' => 'Masaje corporal completo de 60 minutos con aceites aromaticos.',
                'precio'      => 55.00,
                'categoria'   => 'Bienestar',
                'disponible'  => true,
            ],
            [
                'nombre'      => 'Traslado aeropuerto',
                'descripcion' => 'Servicio de traslado privado desde/hasta el aeropuerto en vehiculo de lujo.',
                'precio'      => 50.00,
                'categoria'   => 'Transporte',
                'disponible'  => true,
            ],
            [
                'nombre'      => 'Parking privado',
                'descripcion' => 'Plaza de parking cubierto con vigilancia 24h por noche de estancia.',
                'precio'      => 15.00,
                'categoria'   => 'Transporte',
                'disponible'  => true,
            ],
            [
                'nombre'      => 'Late checkout',
                'descripcion' => 'Extension de la hora de salida hasta las 16:00h (sujeto a disponibilidad).',
                'precio'      => 30.00,
                'categoria'   => 'Alojamiento',
                'disponible'  => true,
            ],
            [
                'nombre'      => 'Early check-in',
                'descripcion' => 'Entrada anticipada desde las 10:00h (sujeto a disponibilidad).',
                'precio'      => 25.00,
                'categoria'   => 'Alojamiento',
                'disponible'  => true,
            ],
            [
                'nombre'      => 'Minibar premium',
                'descripcion' => 'Minibar surtido con bebidas premium y snacks gourmet.',
                'precio'      => 20.00,
                'categoria'   => 'Restauracion',
                'disponible'  => true,
            ],
            [
                'nombre'      => 'Excursion guiada',
                'descripcion' => 'Tour guiado por los principales puntos de interes de la ciudad.',
                'precio'      => 40.00,
                'categoria'   => 'Ocio',
                'disponible'  => true,
            ],
        ];

        foreach ($servicios as $datos) {
            Servicio::create($datos);
        }
    }
}
