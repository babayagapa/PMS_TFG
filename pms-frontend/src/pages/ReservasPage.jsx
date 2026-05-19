import { useState } from 'react'
import Navbar from '../layouts/Navbar'
import Spinner from '../components/Spinner'
import Badge from '../components/Badge'
import { useReservas } from '../hooks/useReservas'
import { pagarReserva, cancelarReserva } from '../services/reservas.service'
import { formatDate, formatEuros } from '../utils/formatDate'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const IMG_MAP = {
  Individual: '/img/individual.png',
  Doble:      '/img/doble.png',
  Suite:      '/img/suite.png',
  Familiar:   '/img/familiar.png',
}

export default function ReservasPage() {
  const { reservas, loading } = useReservas()
  const nav = useNavigate()
  const [modalPago, setModalPago] = useState(null)
  const [metodoPago, setMetodoPago] = useState('tarjeta')
  const [pagando, setPagando] = useState(false)

  const handleCancelar = async (id) => {
    if (!window.confirm('¿¿Cancelar esta reserva?')) return
    try { await cancelarReserva(id); toast.success('Reserva cancelada'); window.location.reload() }
    catch (_) { toast.error('No se pudo cancelar') }
  }

  const handlePagar = async () => {
    setPagando(true)
    try {
      const { data } = await pagarReserva(modalPago._id, { metodo_pago: metodoPago })
      toast.success('Pago realizado con éxito')
      setModalPago(null)
      if (data.factura?._id) nav(`/facturas/${data.factura._id}`)
      else window.location.reload()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al procesar el pago')
    } finally { setPagando(false) }
  }

  const reservasActivas = reservas.filter(r => {
    const fechaSalida = new Date(r.fecha_salida)
    const hoy = new Date()
    hoy.setHours(0,0,0,0)
    
    // Ocultar si ya paso la fecha de salida y esta pagada
    if (fechaSalida < hoy && r.estado_pago === 'pagado') {
      return false
    }
    return true
  })

  return (
    <div className="Page">
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
        <h2 style={{ margin: '0 0 24px', fontSize: '1.8rem', fontWeight: 700 }}>Mis Reservas</h2>
        
        {loading ? <Spinner /> : reservasActivas.length === 0 ? (
          <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
            <p style={{ color: '#999', fontSize: '15px' }}>No tienes reservas todavía.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {reservasActivas.map(r => {
              // Obtener info de la habitacion si viene poblada, o defaults
              const tipoHab = r.habitacion?.tipo || 'Habitación'
              const numHab = r.habitacion?.numero || 'N/A'
              const imgSrc = IMG_MAP[tipoHab] || '/img/individual.png'

              return (
                <div key={r._id} className="glass" style={{ display: 'flex', overflow: 'hidden', transition: 'box-shadow 0.2s', minHeight: '200px' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.10)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.05)'}
                >
                  <div style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#2C3E50' }}>{tipoHab}</h3>
                          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666', fontWeight: 600 }}>Habitación {numHab}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Badge estado={r.estado} />
                          <Badge estado={r.estado_pago || 'pendiente'} />
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
                        <div>
                          <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: 600 }}>Entrada</p>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#2C3E50' }}>{formatDate(r.fecha_entrada)}</p>
                        </div>
                        <div>
                          <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: 600 }}>Salida</p>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#2C3E50' }}>{formatDate(r.fecha_salida)}</p>
                        </div>
                        <div>
                          <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: 600 }}>Huéspedes</p>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#2C3E50' }}>{r.num_huespedes}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '16px' }}>
                      <div>
                        <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: 600 }}>Total</p>
                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#2ECC71' }}>{formatEuros(r.precio_total)}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {r.estado !== 'Cancelada' && (
                          <button onClick={() => handleCancelar(r._id)} style={{ padding: '10px 20px', fontSize: '13px', background: 'transparent', border: '2px solid #e74c3c', color: '#e74c3c', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>
                            Cancelar
                          </button>
                        )}
                        {r.estado_pago !== 'pagado' && r.estado !== 'Cancelada' && (
                          <button className="btn-primary" onClick={() => { setModalPago(r); setMetodoPago('tarjeta') }} style={{ padding: '10px 24px', fontSize: '14px' }}>
                            Pagar →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Imagen */}
                  <div style={{ width: '280px', flexShrink: 0 }}>
                    <img src={imgSrc} alt={tipoHab} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Modal de pago */}
        {modalPago && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '420px', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontWeight: 700 }}>Pagar reserva</h3>
                <button onClick={() => setModalPago(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}>&times;</button>
              </div>
              <div style={{ background: 'rgba(46,204,113,0.06)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#666' }}>Huésped: <strong>{modalPago.nombre_huesped}</strong></p>
                <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#666' }}>{formatDate(modalPago.fecha_entrada)} → {formatDate(modalPago.fecha_salida)}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, color: '#2ECC71', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                  <span>Total</span><span>{formatEuros(modalPago.precio_total)}</span>
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label className="input-label">Método de pago</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[{ value: 'tarjeta', label: '💳 Tarjeta' }, { value: 'efectivo', label: '💵 Efectivo' }, { value: 'transferencia', label: '🏦 Transferencia' }].map(m => (
                    <button key={m.value} type="button" onClick={() => setMetodoPago(m.value)} style={{ flex: 1, padding: '12px', fontSize: '13px', fontWeight: 600, border: metodoPago === m.value ? '2px solid #2ECC71' : '1px solid rgba(0,0,0,0.1)', background: metodoPago === m.value ? 'rgba(46,204,113,0.08)' : 'rgba(255,255,255,0.6)', color: metodoPago === m.value ? '#27AE60' : '#666', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>{m.label}</button>
                  ))}
                </div>
              </div>
              <button onClick={handlePagar} disabled={pagando} className="btn-primary" style={{ width: '100%' }}>{pagando ? 'Procesando...' : `Pagar ${formatEuros(modalPago.precio_total)}`}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
