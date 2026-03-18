<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Controlador de Usuarios (Users)
 *
 * Acceso exclusivo para el rol Administrador (protegido en rutas/middleware).
 */
class UserController extends Controller
{
    /**
     * Lista todos los usuarios.
     *
     * GET /api/users
     */
    public function index(): JsonResponse
    {
        return response()->json(User::all()->makeHidden(['password', 'remember_token']));
    }

    /**
     * Crea un nuevo usuario.
     *
     * POST /api/users
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nombre'    => ['required', 'string', 'max:100'],
            'apellidos' => ['required', 'string', 'max:150'],
            'nif'       => ['required', 'string', 'max:20', Rule::unique('users', 'nif')],
            'email'     => ['required', 'email', Rule::unique('users', 'email')],
            'password'  => ['required', 'string', 'min:8'],
            'rol'       => ['required', Rule::in(User::ROLES)],
        ]);

        $user = User::create($data);

        return response()->json(
            $user->only(['_id', 'nombre', 'apellidos', 'nif', 'email', 'rol']),
            201
        );
    }

    /**
     * Muestra un usuario específico.
     *
     * GET /api/users/{id}
     */
    public function show(User $user): JsonResponse
    {
        return response()->json($user->makeHidden(['password', 'remember_token']));
    }

    /**
     * Actualiza un usuario.
     *
     * PUT /api/users/{id}
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'nombre'    => ['sometimes', 'string', 'max:100'],
            'apellidos' => ['sometimes', 'string', 'max:150'],
            'nif'       => ['sometimes', 'string', 'max:20', Rule::unique('users', 'nif')->ignore($user->id, '_id')],
            'email'     => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id, '_id')],
            'password'  => ['sometimes', 'string', 'min:8'],
            'rol'       => ['sometimes', Rule::in(User::ROLES)],
        ]);

        $user->update($data);

        return response()->json($user->makeHidden(['password', 'remember_token']));
    }

    /**
     * Elimina un usuario.
     *
     * DELETE /api/users/{id}
     */
    public function destroy(User $user): JsonResponse
    {
        $user->delete();
        return response()->json(['message' => 'Usuario eliminado correctamente.']);
    }
}
