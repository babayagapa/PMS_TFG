<?php

namespace App\Models;

use MongoDB\Laravel\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    protected $connection = 'mongodb';
    protected $collection = 'usuarios';

    protected $fillable = [
        'nombre',
        'email',
        'password',
        'rol',
        'nif',
        'telefono',
    ];

    protected $hidden = [
        'password',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'rol'    => $this->rol,
            'nombre' => $this->nombre,
        ];
    }

    public function setPasswordAttribute(string $value): void
    {
        $this->attributes['password'] = Hash::make($value);
    }

    // --- Helpers de rol ---

    public function esAdmin(): bool
    {
        return $this->rol === 'admin';
    }

    public function esRecepcionista(): bool
    {
        return $this->rol === 'recepcionista';
    }

    public function esCliente(): bool
    {
        return $this->rol === 'cliente';
    }

    // --- Relaciones ---

    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'id_cliente');
    }

    public function facturas()
    {
        return $this->hasMany(Factura::class, 'id_cliente');
    }
}
