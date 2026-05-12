<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

// Login, logout y datos del usuario autenticado
class AuthController extends Controller
{
    public function login(Request $request)
    {
        // TODO: validar email+password, devolver token JWT
    }

    public function logout()
    {
        // TODO: invalidar token
    }

    public function me()
    {
        // TODO: devolver usuario autenticado
    }
}