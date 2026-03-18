<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

/**
 * Modelo Habitación (Room)
 *
 * Colección MongoDB: rooms
 *
 * @property string      $_id                  Identificador único generado por MongoDB (ObjectId)
 * @property int         $numero               Número de habitación
 * @property string      $tipo                 Tipo de habitación (ver constantes TIPO_*)
 * @property float       $precio_noche         Precio por noche en EUR
 * @property string      $estado_limpieza      Estado de limpieza (ver constantes LIMPIEZA_*)
 * @property string      $estado_ocupacion     Estado de ocupación (ver constantes OCUPACION_*)
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Room extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'rooms';

    // ── Tipos de habitación ───────────────────────────────────────────────────
    public const TIPO_INDIVIDUAL = 'Individual';
    public const TIPO_DOBLE      = 'Doble';
    public const TIPO_SUITE      = 'Suite';

    public const TIPOS = [
        self::TIPO_INDIVIDUAL,
        self::TIPO_DOBLE,
        self::TIPO_SUITE,
    ];

    // ── Estado de limpieza ────────────────────────────────────────────────────
    public const LIMPIEZA_LIMPIA       = 'Limpia';
    public const LIMPIEZA_SUCIA        = 'Sucia';
    public const LIMPIEZA_MANTENIMIENTO = 'Mantenimiento';

    public const ESTADOS_LIMPIEZA = [
        self::LIMPIEZA_LIMPIA,
        self::LIMPIEZA_SUCIA,
        self::LIMPIEZA_MANTENIMIENTO,
    ];

    // ── Estado de ocupación ───────────────────────────────────────────────────
    public const OCUPACION_LIBRE   = 'Libre';
    public const OCUPACION_OCUPADA = 'Ocupada';

    public const ESTADOS_OCUPACION = [
        self::OCUPACION_LIBRE,
        self::OCUPACION_OCUPADA,
    ];

    /**
     * Atributos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'numero',
        'tipo',
        'precio_noche',
        'estado_limpieza',
        'estado_ocupacion',
    ];

    /**
     * Atributos con cast automático.
     */
    protected $casts = [
        'numero'       => 'integer',
        'precio_noche' => 'float',
    ];

    // ── Relaciones ────────────────────────────────────────────────────────────

    /**
     * Reservas asociadas a esta habitación.
     */
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'habitacion_id');
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Indica si la habitación está disponible para reservar.
     */
    public function estaDisponible(): bool
    {
        return $this->estado_ocupacion === self::OCUPACION_LIBRE
            && $this->estado_limpieza  === self::LIMPIEZA_LIMPIA;
    }
}
