<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nombre'    => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'email'     => 'required|email|unique:usuarios,email',
            'password'  => 'required|string|min:6|confirmed',
            'nif'       => 'required|string|regex:/^[0-9]{8}[A-Za-z]$/',
            'telefono'  => 'required|string|regex:/^[0-9]{9}$/',
        ]);

        $user = User::create([
            'nombre'    => $request->nombre,
            'apellidos' => $request->apellidos,
            'email'     => $request->email,
            'password'  => $request->password,
            'rol'       => 'cliente',
            'nif'       => $request->nif,
            'telefono'  => $request->telefono,
        ]);

        $token = Auth::guard('api')->login($user);

        return response()->json([
            'message' => 'Registro exitoso',
            'token'   => $token,
            'user'    => [
                'id'        => $user->_id,
                'nombre'    => $user->nombre,
                'apellidos' => $user->apellidos,
                'email'     => $user->email,
                'rol'       => $user->rol,
                'nif'       => $user->nif,
                'telefono'  => $user->telefono,
            ],
        ], 201);
    }

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
                'id'        => $user->_id,
                'nombre'    => $user->nombre,
                'apellidos' => $user->apellidos ?? '',
                'email'     => $user->email,
                'rol'       => $user->rol,
                'nif'       => $user->nif ?? null,
                'telefono'  => $user->telefono ?? null,
            ],
        ]);
    }

    public function logout()
    {
        Auth::guard('api')->logout();

        return response()->json(['message' => 'Sesion cerrada']);
    }

    public function me()
    {
        $user = Auth::guard('api')->user();

        return response()->json([
            'id'        => $user->_id,
            'nombre'    => $user->nombre,
            'apellidos' => $user->apellidos ?? '',
            'email'     => $user->email,
            'rol'       => $user->rol,
            'nif'       => $user->nif ?? null,
            'telefono'  => $user->telefono ?? null,
        ]);
    }

    public function registerPersonal(Request $request)
    {
        $request->validate([
            'nombre'    => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'email'     => 'required|email|unique:usuarios,email',
            'password'  => 'required|string|min:6|confirmed',
            'nif'       => 'required|string|regex:/^[0-9]{8}[A-Za-z]$/',
            'telefono'  => 'required|string|regex:/^[0-9]{9}$/',
            'rol'       => 'required|string|in:recepcionista,limpieza',
        ]);

        $user = User::create([
            'nombre'    => $request->nombre,
            'apellidos' => $request->apellidos,
            'email'     => $request->email,
            'password'  => $request->password,
            'rol'       => $request->rol,
            'nif'       => $request->nif,
            'telefono'  => $request->telefono,
        ]);

        return response()->json([
            'message' => 'Empleado registrado correctamente',
            'user'    => [
                'id'        => $user->_id,
                'nombre'    => $user->nombre,
                'apellidos' => $user->apellidos,
                'email'     => $user->email,
                'rol'       => $user->rol,
                'nif'       => $user->nif,
                'telefono'  => $user->telefono,
            ],
        ], 201);
    }
}