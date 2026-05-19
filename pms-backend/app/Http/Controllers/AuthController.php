<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // POST /api/register — solo registra clientes
    public function register(Request $request)
    {
        $request->validate([
            'nombre'   => 'required|string|max:255',
            'email'    => 'required|email|unique:usuarios,email',
            'password' => 'required|string|min:6|confirmed',
            'nif'      => 'required|string|max:20',
            'telefono' => 'required|string|max:20',
        ]);

        $user = User::create([
            'nombre'   => $request->nombre,
            'email'    => $request->email,
            'password' => $request->password,
            'rol'      => 'cliente',
            'nif'      => $request->nif,
            'telefono' => $request->telefono,
        ]);

        $token = Auth::guard('api')->login($user);

        return response()->json([
            'message' => 'Registro exitoso',
            'token'   => $token,
            'user'    => [
                'id'       => $user->_id,
                'nombre'   => $user->nombre,
                'email'    => $user->email,
                'rol'      => $user->rol,
                'nif'      => $user->nif,
                'telefono' => $user->telefono,
            ],
        ], 201);
    }

    // POST /api/login
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $token = Auth::guard('api')->attempt(
            $request->only('email', 'password')
        );

        if (!$token) {
            return response()->json(['error' => 'Credenciales incorrectas'], 401);
        }

        $user = Auth::guard('api')->user();

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'       => $user->_id,
                'nombre'   => $user->nombre,
                'email'    => $user->email,
                'rol'      => $user->rol,
                'nif'      => $user->nif ?? null,
                'telefono' => $user->telefono ?? null,
            ],
        ]);
    }

    // POST /api/logout
    public function logout()
    {
        Auth::guard('api')->logout();

        return response()->json(['message' => 'Sesion cerrada']);
    }

    // GET /api/me
    public function me()
    {
        $user = Auth::guard('api')->user();

        return response()->json([
            'id'       => $user->_id,
            'nombre'   => $user->nombre,
            'email'    => $user->email,
            'rol'      => $user->rol,
            'nif'      => $user->nif ?? null,
            'telefono' => $user->telefono ?? null,
        ]);
    }

    // POST /api/personal/register — solo admin puede registrar recepcionistas
    public function registerPersonal(Request $request)
    {
        $request->validate([
            'nombre'   => 'required|string|max:255',
            'email'    => 'required|email|unique:usuarios,email',
            'password' => 'required|string|min:6|confirmed',
            'nif'      => 'required|string|max:20',
            'telefono' => 'required|string|max:20',
        ]);

        $user = User::create([
            'nombre'   => $request->nombre,
            'email'    => $request->email,
            'password' => $request->password,
            'rol'      => 'recepcionista',
            'nif'      => $request->nif,
            'telefono' => $request->telefono,
        ]);

        return response()->json([
            'message' => 'Recepcionista registrado correctamente',
            'user'    => [
                'id'       => $user->_id,
                'nombre'   => $user->nombre,
                'email'    => $user->email,
                'rol'      => $user->rol,
                'nif'      => $user->nif,
                'telefono' => $user->telefono,
            ],
        ], 201);
    }
}
