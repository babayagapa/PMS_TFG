<?php

namespace App\Http\Controllers;

use App\Models\Servicio;
use Illuminate\Http\Request;

class ServicioController extends Controller
{
    public function index()
    {
        $servicios = Servicio::where('disponible', true)
            ->orderBy('categoria')
            ->orderBy('nombre')
            ->get();

        return response()->json($servicios);
    }

    public function show(string $id)
    {
        $servicio = Servicio::findOrFail($id);

        return response()->json($servicio);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre'      => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio'      => 'required|numeric|min:0',
            'categoria'   => 'required|string|max:100',
            'disponible'  => 'boolean',
        ]);

        $servicio = Servicio::create([
            'nombre'      => $request->nombre,
            'descripcion' => $request->descripcion ?? '',
            'precio'      => $request->precio,
            'categoria'   => $request->categoria,
            'disponible'  => $request->disponible ?? true,
        ]);

        return response()->json($servicio, 201);
    }

    public function update(Request $request, string $id)
    {
        $servicio = Servicio::findOrFail($id);

        $servicio->update($request->only([
            'nombre',
            'descripcion',
            'precio',
            'categoria',
            'disponible',
        ]));

        return response()->json($servicio);
    }

    public function destroy(string $id)
    {
        $servicio = Servicio::findOrFail($id);
        $servicio->delete();

        return response()->json(['message' => 'Servicio eliminado']);
    }
}