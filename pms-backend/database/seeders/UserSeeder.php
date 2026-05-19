<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

// Crea los usuarios iniciales del sistema
class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Limpiar la coleccion antes de insertar
        User::truncate();

        User::create([
            'nombre'    => 'Administrador',
            'apellidos' => '',
            'email'     => 'admin@hotel.com',
            'password'  => 'admin123',
            'rol'       => 'admin',
            'nif'       => '00000000A',
            'telefono'  => '+34 600 000 000',
        ]);

        User::create([
            'nombre'    => 'Ana',
            'apellidos' => 'Garcia Martinez',
            'email'     => 'recepcion@hotel.com',
            'password'  => 'recep123',
            'rol'       => 'recepcionista',
            'nif'       => '12345678A',
            'telefono'  => '+34 611 111 111',
        ]);

        User::create([
            'nombre'    => 'Carlos',
            'apellidos' => 'Lopez Fernandez',
            'email'     => 'recepcion2@hotel.com',
            'password'  => 'recep456',
            'rol'       => 'recepcionista',
            'nif'       => '87654321B',
            'telefono'  => '+34 622 222 222',
        ]);

        User::create([
            'nombre'    => 'Maria Eugenia',
            'apellidos' => 'Gonzalez Campos',
            'email'     => 'limpieza@hotel.com',
            'password'  => 'limp123',
            'rol'       => 'limpieza',
            'nif'       => '11223344C',
            'telefono'  => '+34 633 333 333',
        ]);
    }
}
