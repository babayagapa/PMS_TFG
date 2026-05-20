<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Habitacion extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'habitaciones';

    protected $fillable = [
        'numero',
        'tipo',
        'precio_noche',
        'estado_limpieza',
        'ocupada',
        'capacidad',
        'descripcion',
        'amenidades',
    ];

    protected $casts = [
        'ocupada'      => 'boolean',
        'precio_noche' => 'float',
        'capacidad'    => 'integer',
        'amenidades'   => 'array',
    ];

    public function estaDisponible(): bool
    {
        return !$this->ocupada && $this->estado_limpieza === 'Limpia';
    }

    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'id_habitacion');
    }
}