import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../layouts/Sidebar'
import Spinner from '../components/Spinner'
import Badge from '../components/Badge'
import { useReservas } from '../hooks/useReservas'
import { useFacturas } from '../hooks/useFacturas'
import { confirmarReserva, cancelarReserva, pagarReserva } from '../services/reservas.service'
import { formatDate, formatEuros } from '../utils/formatDate'
import toast from 'react-hot-toast'

export default function ReservasStaffPage() {
  const { reservas, loading } = useReservas()
  const { facturas, loading: loadFacturas } = useFacturas()
  const nav = useNavigate()
  const [tab, setTab] = useState('reservas')
  const [modalPago, setModalPago] = useState(null)
  const [metodoPago, setMetodoPago] = useState('tarjeta')
  const [pagando, setPagando] = useState(false)

  const handleConfirmar = async (id) => {
    try { await confirmarReserva(id); toast.success('Reserva confirmada'); window.location.reload() }
    catch (_) { toast.error('No se pudo confirmar') }
  }
  const handleCancelar = async (id) => {
    if (!window.confirm('Cancelar esta reserva?')) return
    try { await cancelarReserva(id); toast.success('Reserva cancelada'); window.location.reload() }
    catch (_) { toast.error('No se pudo cancelar') }
  }
  const handlePagar = async () => {
    setPagando(true)
    try {
      const { data } = await pagarReserva(modalPago._id, { metodo_pago: metodoPago })
      toast.success('Pago realizado con exito')
      setModalPago(null)
      window.location.reload()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al procesar el pago')
    } finally { setPagando(false) }
  }

  const tabStyle = (active) => ({
    padding: '10px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
    border: 'none', borderRadius: '10px 10px 0 0', transition: 'all 0.2s',
    background: active ? 'rgba(46,204,113,0.1)' : 'transparent',
    color: active ? '#27AE60' : '#999',
    borderBottom: active ? '2px solid #2ECC71' : '2px solid transparent',
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
          <button style={tabStyle(tab === 'reservas')} onClick={() => setTab('reservas')}>📋 Reservas</button>
          <button style={tabStyle(tab === 'facturas')} onClick={() => setTab('facturas')}>🧾 Facturas</button>
        </div>

        {tab === 'reservas' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>Reservas</h2>
              <button className="btn-primary" onClick={() => nav('/reservas/nueva')} style={{ padding: '10px 24px', fontSize: '14px' }}>
                + Nueva reserva
              </button>
            </div>
            {loading ? <Spinner /> : (
              <div className="glass" style={{ padding: '8px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      {['Huesped', 'Habitacion', 'Entrada', 'Salida', 'Total', 'Estado', 'Pago', 'Acciones'].map(h => (
                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: '#2C3E50', opacity: 0.7 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.length === 0 ? (
                      <tr><td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No hay reservas todavia.</td></tr>
                    ) : reservas.map(r => (
                      <tr key={r._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                        <td style={{ padding: '14px 16px' }}>{r.nombre_huesped}</td>
                        <td style={{ padding: '14px 16px' }}>{r.id_habitacion}</td>
                        <td style={{ padding: '14px 16px' }}>{formatDate(r.fecha_entrada)}</td>
                        <td style={{ padding: '14px 16px' }}>{formatDate(r.fecha_salida)}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 600 }}>{formatEuros(r.precio_total)}</td>
                        <td style={{ padding: '14px 16px' }}><Badge estado={r.estado} /></td>
                        <td style={{ padding: '14px 16px' }}><Badge estado={r.estado_pago || 'pendiente'} /></td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {r.estado === 'Pendiente' && <button onClick={() => handleConfirmar(r._id)} className="btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }}>Confirmar</button>}
                            {r.estado_pago !== 'pagado' && r.estado !== 'Cancelada' && (
                              <button onClick={() => { setModalPago(r); setMetodoPago('tarjeta') }} style={{ padding: '6px 14px', fontSize: '12px', background: '#2ECC71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Pagar</button>
                            )}
                            {r.estado !== 'Cancelada' && <button onClick={() => handleCancelar(r._id)} style={{ padding: '6px 14px', fontSize: '12px', background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === 'facturas' && (
          <>
            <h2 style={{ margin: '0 0 20px', fontSize: '1.8rem', fontWeight: 700 }}>Facturas</h2>
            {loadFacturas ? <Spinner /> : facturas.length === 0 ? (
              <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
                <p style={{ color: '#999', fontSize: '15px' }}>No hay facturas todavia.</p>
                <p style={{ color: '#bbb', fontSize: '13px', marginTop: '8px' }}>Las facturas se generan automaticamente al pagar una reserva.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {facturas.map(f => (
                  <Link key={f._id} to={`/facturas/${f._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="glass" style={{ padding: '24px', transition: 'box-shadow 0.2s', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.10)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.05)'}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: '#2C3E50' }}>{f.numero_factura}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#999' }}>{formatDate(f.fecha)}</p>
                        </div>
                        <span style={{ fontSize: '11px', background: 'rgba(46,204,113,0.1)', color: '#27AE60', padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(46,204,113,0.2)', fontWeight: 600 }}>{f.metodo_pago}</span>
                      </div>
                      <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#666' }}>{f.datos_cliente?.nombre}</p>
                      <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '12px', marginTop: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, color: '#2ECC71' }}><span>Total</span><span>{formatEuros(f.total)}</span></div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
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
                <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#666' }}>Huesped: <strong>{modalPago.nombre_huesped}</strong></p>
                <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#666' }}>{formatDate(modalPago.fecha_entrada)} → {formatDate(modalPago.fecha_salida)}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, color: '#2ECC71', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                  <span>Total</span><span>{formatEuros(modalPago.precio_total)}</span>
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label className="input-label">Metodo de pago</label>
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
      </main>
    </div>
  )
}
