<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Servicio extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'servicios';

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'categoria',
        'disponible',
    ];

    protected $casts = [
        'precio'     => 'float',
        'disponible' => 'boolean',
    ];
}