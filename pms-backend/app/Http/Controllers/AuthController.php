<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
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
                'id'     => $user->id,
                'nombre' => $user->nombre,
                'email'  => $user->email,
                'rol'    => $user->rol,
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
            'id'     => $user->id,
            'nombre' => $user->nombre,
            'email'  => $user->email,
            'rol'    => $user->rol,
        ]);
    }
}
