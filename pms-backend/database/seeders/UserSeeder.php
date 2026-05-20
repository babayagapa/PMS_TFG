<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::truncate();

        User::create([
            'nombre'    => 'Administrador',
            'apellidos' => '',
            'email'     => 'admin@hotel.com',
            'password'  => 'admin123',
            'rol'       => 'admin',
            'nif'       => '00000000A',
            'telefono'  => '600000000',
        ]);

        User::create([
            'nombre'    => 'Ana',
            'apellidos' => 'Garcia Martinez',
            'email'     => 'recepcion@hotel.com',
            'password'  => 'recep123',
            'rol'       => 'recepcionista',
            'nif'       => '12345678A',
            'telefono'  => '611111111',
        ]);

        User::create([
            'nombre'    => 'Carlos',
            'apellidos' => 'Lopez Fernandez',
            'email'     => 'recepcion2@hotel.com',
            'password'  => 'recep456',
            'rol'       => 'recepcionista',
            'nif'       => '87654321B',
            'telefono'  => '622222222',
        ]);

        User::create([
            'nombre'    => 'Maria Eugenia',
            'apellidos' => 'Gonzalez Campos',
            'email'     => 'limpieza@hotel.com',
            'password'  => 'limp123',
            'rol'       => 'limpieza',
            'nif'       => '11223344C',
            'telefono'  => '633333333',
        ]);

        User::create([
            'nombre'    => 'Laura',
            'apellidos' => 'Martinez Perez',
            'email'     => 'laura@mail.com',
            'password'  => 'lau123',
            'rol'       => 'cliente',
            'nif'       => '44556677D',
            'telefono'  => '644444444',
        ]);
    }
}