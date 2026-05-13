import Navbar from '../layouts/Navbar'
import Spinner from '../components/Spinner'
import Badge from '../components/Badge'
import { useReservas } from '../hooks/useReservas'
import { formatDate, formatEuros } from '../utils/formatDate'

// Tabla de reservas para el panel de recepción
export default function ReservasPage() {
  const { reservas, loading } = useReservas()

  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Reservas</h2>
        {loading ? <Spinner /> : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Huésped</th>
                <th className="p-2 text-left">Habitación</th>
                <th className="p-2 text-left">Entrada</th>
                <th className="p-2 text-left">Salida</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map(r => (
                <tr key={r._id} className="border-t">
                  <td className="p-2">{r.nombre_huesped}</td>
                  <td className="p-2">{r.habitacion_id}</td>
                  <td className="p-2">{formatDate(r.fecha_entrada)}</td>
                  <td className="p-2">{formatDate(r.fecha_salida)}</td>
                  <td className="p-2">{formatEuros(r.precio_total)}</td>
                  <td className="p-2"><Badge estado={r.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}