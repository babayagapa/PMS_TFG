<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

/**
 * Modelo Reserva (Reservation)
 *
 * Colección MongoDB: reservations
 *
 * @property string      $_id            Identificador único generado por MongoDB (ObjectId)
 * @property string      $cliente_id     ObjectId del usuario con rol Cliente
 * @property string      $habitacion_id  ObjectId de la habitación reservada
 * @property \Carbon\Carbon $fecha_entrada  Fecha de check-in
 * @property \Carbon\Carbon $fecha_salida   Fecha de check-out
 * @property float       $precio_total   Precio total calculado de la estancia
 * @property string      $estado         Estado de la reserva (ver constantes ESTADO_*)
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Reservation extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'reservations';

    // ── Estados de reserva ────────────────────────────────────────────────────
    public const ESTADO_CONFIRMADA = 'Confirmada';
    public const ESTADO_CANCELADA  = 'Cancelada';
    public const ESTADO_FINALIZADA = 'Finalizada';

    public const ESTADOS = [
        self::ESTADO_CONFIRMADA,
        self::ESTADO_CANCELADA,
        self::ESTADO_FINALIZADA,
    ];

    /**
     * Atributos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'cliente_id',
        'habitacion_id',
        'fecha_entrada',
        'fecha_salida',
        'precio_total',
        'estado',
    ];

    /**
     * Atributos con cast automático.
     */
    protected $casts = [
        'fecha_entrada' => 'datetime',
        'fecha_salida'  => 'datetime',
        'precio_total'  => 'float',
    ];

    // ── Relaciones ────────────────────────────────────────────────────────────

    /**
     * Cliente propietario de la reserva.
     */
    public function cliente()
    {
        return $this->belongsTo(User::class, 'cliente_id');
    }

    /**
     * Habitación asociada a la reserva.
     */
    public function habitacion()
    {
        return $this->belongsTo(Room::class, 'habitacion_id');
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Calcula el número de noches de la reserva.
     */
    public function numeroNoches(): int
    {
        return (int) $this->fecha_entrada->diffInDays($this->fecha_salida);
    }

    /**
     * Indica si la reserva está activa (confirmada).
     */
    public function estaActiva(): bool
    {
        return $this->estado === self::ESTADO_CONFIRMADA;
    }
}
