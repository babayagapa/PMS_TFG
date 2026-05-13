<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

// CRUD de habitaciones
class HabitacionController extends Controller
{
    public function index()
    {
        // TODO: listar habitaciones, filtro por estado y tipo
    }

    public function show($id)
    {
        // TODO: detalle de una habitación
    }

    public function store(Request $request)
    {
        // TODO: crear habitación (solo admin)
    }

    public function update(Request $request, $id)
    {
        // TODO: editar habitación (solo admin)
    }

    public function destroy($id)
    {
        // TODO: eliminar habitación si no tiene reservas activas
    }
}