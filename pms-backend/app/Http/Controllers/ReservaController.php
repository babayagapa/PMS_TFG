<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

// Gestión de reservas. Regla: no reservar si habitación está ocupada.
// Precio = precio_noche * noches * 1.10
class ReservaController extends Controller
{
    public function index()
    {
        // TODO: listar reservas, filtro por estado
    }

    public function show($id)
    {
        // TODO: detalle de una reserva
    }

    public function store(Request $request)
    {
        // TODO: crear reserva, validar disponibilidad, calcular precio
    }

    public function update(Request $request, $id)
    {
        // TODO: actualizar datos del huésped
    }

    public function destroy($id)
    {
        // TODO: cancelar reserva y liberar habitación
    }

    public function confirmar($id)
    {
        // TODO: cambiar estado a confirmada
    }
}