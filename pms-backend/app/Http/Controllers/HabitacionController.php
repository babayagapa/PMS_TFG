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
        // TODO: detalle de una habitaciÃ³n
    }

    public function store(Request $request)
    {
        // TODO: crear habitaciÃ³n (solo admin)
    }

    public function update(Request $request, $id)
    {
        // TODO: editar habitaciÃ³n (solo admin)
    }

    public function destroy($id)
    {
        // TODO: eliminar habitaciÃ³n si no tiene reservas activas
    }
}