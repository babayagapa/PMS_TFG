<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Controlador de Autenticación
 *
 * Gestiona login, logout y registro de usuarios mediante Laravel Sanctum.
 */
class AuthController extends Controller
{
    /**
     * Autentica un usuario y devuelve un token Sanctum.
     *
     * POST /api/auth/login
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales no son correctas.'],
            ]);
        }

        $token = $user->createToken('pms_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $user->only(['_id', 'nombre', 'apellidos', 'email', 'rol']),
        ]);
    }

    /**
     * Registra un nuevo usuario (solo Administradores en producción).
     *
     * POST /api/auth/register
     */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nombre'    => ['required', 'string', 'max:100'],
            'apellidos' => ['required', 'string', 'max:150'],
            'nif'       => ['required', 'string', 'max:20', Rule::unique('users', 'nif')],
            'email'     => ['required', 'email', Rule::unique('users', 'email')],
            'password'  => ['required', 'string', 'min:8', 'confirmed'],
            'rol'       => ['required', Rule::in(User::ROLES)],
        ]);

        $user = User::create($data);

        return response()->json([
            'message' => 'Usuario creado correctamente.',
            'user'    => $user->only(['_id', 'nombre', 'apellidos', 'email', 'rol']),
        ], 201);
    }

    /**
     * Invalida el token actual del usuario autenticado.
     *
     * POST /api/auth/logout
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }

    /**
     * Devuelve los datos del usuario autenticado.
     *
     * GET /api/auth/me
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user()->only([
            '_id', 'nombre', 'apellidos', 'nif', 'email', 'rol',
        ]));
    }
}
