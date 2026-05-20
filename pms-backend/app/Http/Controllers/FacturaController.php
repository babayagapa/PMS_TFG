<?php

namespace App\Http\Controllers;

use App\Models\Factura;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FacturaController extends Controller
{
    public function index(Request $request)
    {
        $user  = Auth::guard('api')->user();
        $query = Factura::query();

        if ($user->rol === 'cliente') {
            $query->where('id_cliente', (string) $user->_id);
        }

        if ($request->has('desde')) {
            $query->where('fecha', '>=', $request->desde);
        }
        if ($request->has('hasta')) {
            $query->where('fecha', '<=', $request->hasta);
        }

        $facturas = $query->orderBy('fecha', 'desc')->get();

        return response()->json($facturas);
    }

    public function show(string $id)
    {
        $user    = Auth::guard('api')->user();
        $factura = Factura::findOrFail($id);

        if ($user->rol === 'cliente' && $factura->id_cliente !== (string) $user->_id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        return response()->json($factura);
    }
}