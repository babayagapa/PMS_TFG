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
    try { await confirmarReserva(id); toast.success('Reserva confirmada'); window.location.reload() }
    catch (_) { toast.error('No se pudo confirmar') }
  }

  const handleCancelar = async (id) => {
    if (!window.confirm('Cancelar esta reserva?')) return
    try { await cancelarReserva(id); toast.success('Reserva cancelada'); window.location.reload() }
    catch (_) { toast.error('No se pudo cancelar') }
  }

  return (
    <div className="page">
      <Navbar />
      <h2 style={{ margin: '0 0 24px', fontSize: '1.8rem', fontWeight: 700 }}>Reservas</h2>

      {loading ? <Spinner /> : (
        <div className="glass" style={{ padding: '8px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                {['Huesped', 'Habitacion', 'Entrada', 'Salida', 'Total', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: '#2C3E50', opacity: 0.7 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reservas.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No hay reservas todavia.</td></tr>
              ) : reservas.map(r => (
                <tr key={r._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <td style={{ padding: '14px 16px' }}>{r.nombre_huesped}</td>
                  <td style={{ padding: '14px 16px' }}>{r.id_habitacion}</td>
                  <td style={{ padding: '14px 16px' }}>{formatDate(r.fecha_entrada)}</td>
                  <td style={{ padding: '14px 16px' }}>{formatDate(r.fecha_salida)}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{formatEuros(r.precio_total)}</td>
                  <td style={{ padding: '14px 16px' }}><Badge estado={r.estado} /></td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {r.estado === 'Pendiente' && (
                        <button onClick={() => handleConfirmar(r._id)} className="btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }}>Confirmar</button>
                      )}
                      {r.estado !== 'Cancelada' && (
                        <button onClick={() => handleCancelar(r._id)} style={{ padding: '6px 14px', fontSize: '12px', background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
