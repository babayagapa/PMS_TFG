<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

// GestiÃ³n de reservas. Regla: no reservar si habitaciÃ³n estÃ¡ ocupada.
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
        // TODO: actualizar datos del huÃ©sped
    }

    public function destroy($id)
    {
        // TODO: cancelar reserva y liberar habitaciÃ³n
    }

    public function confirmar($id)
    {
        // TODO: cambiar estado a confirmada
    }
}