<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use MongoDB\Laravel\Eloquent\Model;

/**
 * Modelo Usuario (User)
 *
 * Colección MongoDB: users
 *
 * @property string      $_id          Identificador único generado por MongoDB (ObjectId)
 * @property string      $nombre       Nombre del usuario
 * @property string      $apellidos    Apellidos del usuario
 * @property string      $nif          NIF/NIE – único en el sistema
 * @property string      $email        Correo electrónico – único en el sistema
 * @property string      $password     Contraseña almacenada con hash bcrypt
 * @property string      $rol          Rol del usuario (ver constantes ROL_*)
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class User extends Model implements AuthenticatableContract
{
    use Authenticatable, HasApiTokens, Notifiable;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    // ── Roles disponibles ────────────────────────────────────────────────────
    public const ROL_ADMINISTRADOR = 'Administrador';
    public const ROL_RECEPCIONISTA = 'Recepcionista';
    public const ROL_LIMPIEZA      = 'Limpieza';
    public const ROL_CLIENTE       = 'Cliente';

    public const ROLES = [
        self::ROL_ADMINISTRADOR,
        self::ROL_RECEPCIONISTA,
        self::ROL_LIMPIEZA,
        self::ROL_CLIENTE,
    ];

    /**
     * Atributos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'nombre',
        'apellidos',
        'nif',
        'email',
        'password',
        'rol',
    ];

    /**
     * Atributos ocultos en la serialización (nunca exponer password ni tokens).
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Atributos con cast automático.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
    ];

    // ── Validación de rol ────────────────────────────────────────────────────

    /**
     * Verifica si el usuario tiene un rol determinado.
     */
    public function hasRol(string $rol): bool
    {
        return $this->rol === $rol;
    }

    /**
     * Verifica si el usuario es Administrador.
     */
    public function esAdministrador(): bool
    {
        return $this->hasRol(self::ROL_ADMINISTRADOR);
    }
}
