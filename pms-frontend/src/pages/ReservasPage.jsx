import Navbar from '../layouts/Navbar'
import Spinner from '../components/Spinner'
import Badge from '../components/Badge'
import { useReservas } from '../hooks/useReservas'
import { confirmarReserva, cancelarReserva } from '../services/reservas.service'
import { formatDate, formatEuros } from '../utils/formatDate'
import toast from 'react-hot-toast'

export default function ReservasPage() {
  const { reservas, loading } = useReservas()

  const handleConfirmar = async (id) => {
    try {
      await confirmarReserva(id)
      toast.success('Reserva confirmada')
      window.location.reload()
    } catch (_) {
      toast.error('No se pudo confirmar')
    }
  }

  const handleCancelar = async (id) => {
    if (!window.confirm('Cancelar esta reserva?')) return
    try {
      await cancelarReserva(id)
      toast.success('Reserva cancelada')
      window.location.reload()
    } catch (_) {
      toast.error('No se pudo cancelar')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Reservas</h2>
        {loading ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Huesped</th>
                  <th className="p-3 text-left">Habitacion</th>
                  <th className="p-3 text-left">Entrada</th>
                  <th className="p-3 text-left">Salida</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Estado</th>
                  <th className="p-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r) => (
                  <tr key={r._id} className="border-t">
                    <td className="p-3">{r.nombre_huesped}</td>
                    <td className="p-3">{r.id_habitacion}</td>
                    <td className="p-3">{formatDate(r.fecha_entrada)}</td>
                    <td className="p-3">{formatDate(r.fecha_salida)}</td>
                    <td className="p-3">{formatEuros(r.precio_total)}</td>
                    <td className="p-3"><Badge estado={r.estado} /></td>
                    <td className="p-3 flex gap-2">
                      {r.estado === 'Pendiente' && (
                        <button
                          onClick={() => handleConfirmar(r._id)}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Confirmar
                        </button>
                      )}
                      {r.estado !== 'Cancelada' && (
                        <button
                          onClick={() => handleCancelar(r._id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
