import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../layouts/Sidebar'
import Spinner from '../components/Spinner'
import Badge from '../components/Badge'
import { useReservas } from '../hooks/useReservas'
import { useHabitaciones } from '../hooks/useHabitaciones'
import { confirmarReserva, cancelarReserva, pagarReserva } from '../services/reservas.service'
import { formatDate, formatEuros } from '../utils/formatDate'
import toast from 'react-hot-toast'

const MS_PER_DAY = 1000 * 60 * 60 * 24
const ROOM_COL_W = 120

export default function ReservasStaffPage() {
  const { reservas, loading: loadingR } = useReservas()
  const { habitaciones, loading: loadingH } = useHabitaciones()
  const loading = loadingR || loadingH

  const nav = useNavigate()
  const [modalPago, setModalPago] = useState(null)
  const [metodoPago, setMetodoPago] = useState('tarjeta')
  const [pagando, setPagando] = useState(false)
  const [tooltip, setTooltip] = useState(null)

  // Gantt State
  const hoy = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }, [])
  const [startDate, setStartDate] = useState(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d })
  const daysToShow = 14

  const nextPeriod = () => { const n = new Date(startDate); n.setDate(n.getDate() + daysToShow); setStartDate(n) }
  const prevPeriod = () => { const p = new Date(startDate); p.setDate(p.getDate() - daysToShow); setStartDate(p) }

  const dates = useMemo(() => Array.from({ length: daysToShow }).map((_, i) => {
    const d = new Date(startDate); d.setDate(d.getDate() + i); return d
  }), [startDate, daysToShow])

  const endDate = dates[dates.length - 1]

  const getReservaColor = (estado, pago) => {
    if (estado === 'Cancelada') return { bg: '#bdc3c7', border: '#95a5a6' }
    if (pago === 'pagado') return { bg: '#27ae60', border: '#1e8449' }           // Verde = pagada
    if (estado === 'Confirmada') return { bg: '#f39c12', border: '#d68910' }     // Amarillo = confirmada sin pagar
    return { bg: '#95a5a6', border: '#7f8c8d' }                                   // Gris = pendiente
  }
  const getReservaLabel = (estado, pago) => {
    if (estado === 'Cancelada') return 'Cancelada'
    if (pago === 'pagado') return 'Pagada'
    if (estado === 'Confirmada') return 'Pte. Pago'
    return 'Pendiente'
  }

  // Mes y ano del rango visible
  const mesLabel = (() => {
    const m1 = startDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    const m2 = endDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    return m1 === m2 ? m1.charAt(0).toUpperCase() + m1.slice(1) : `${m1.charAt(0).toUpperCase() + m1.slice(1)} — ${m2.charAt(0).toUpperCase() + m2.slice(1)}`
  })()

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
      await pagarReserva(modalPago._id, { metodo_pago: metodoPago })
      toast.success('Pago realizado con exito')
      setModalPago(null)
      window.location.reload()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al procesar el pago')
    } finally { setPagando(false) }
  }



  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>Reservas</h2>
          <button className="btn-primary" onClick={() => nav('/reservas/nueva')} style={{ padding: '10px 24px', fontSize: '14px' }}>
            + Nueva reserva
          </button>
        </div>

        {/* ─── CALENDARIO GANTT ─── */}
        <div className="glass" style={{ padding: '0', marginBottom: '32px', overflow: 'hidden', borderRadius: '16px' }}>

          {/* TOOLBAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(0,0,0,0.08)', background: 'rgba(44,62,80,0.03)' }}>
            <div>
              <h3 style={{ margin: 0, fontWeight: 700, color: '#2C3E50', fontSize: '1.1rem' }}>📅 Calendario de Ocupación</h3>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#888', fontWeight: 500 }}>{mesLabel}</p>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={prevPeriod} style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '13px', transition: 'all 0.15s' }}>&larr; Anterior</button>
              <button onClick={nextPeriod} style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '13px', transition: 'all 0.15s' }}>Siguiente &rarr;</button>
            </div>
          </div>

          {/* GANTT GRID */}
          <div style={{ overflowX: 'auto', position: 'relative' }}>
            <div style={{ display: 'flex', minWidth: '700px' }}>

              {/* COLUMNA DE HABITACIONES */}
              <div style={{ width: `${ROOM_COL_W}px`, flexShrink: 0, borderRight: '2px solid rgba(0,0,0,0.1)', background: '#fafbfc', zIndex: 2 }}>
                {/* Header vacio arriba */}
                <div style={{ height: '52px', borderBottom: '2px solid rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Habitación
                </div>
                {/* Filas de habitacion */}
                {!loading && habitaciones.map((hab, idx) => (
                  <div key={hab._id} style={{
                    height: '44px', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '8px',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    background: idx % 2 === 0 ? '#fafbfc' : '#f4f6f8'
                  }}>
                    <span style={{ fontWeight: 700, color: '#2c3e50', fontSize: '13px' }}>{hab.numero}</span>
                    <span style={{ fontSize: '11px', color: '#aaa', fontWeight: 500 }}>{hab.tipo}</span>
                  </div>
                ))}
              </div>

              {/* AREA DEL CALENDARIO */}
              <div style={{ flex: 1 }}>
                {/* Header de dias */}
                <div style={{ display: 'flex', height: '52px', borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
                  {dates.map(d => {
                    const esHoy = d.getTime() === hoy.getTime()
                    const esFinde = d.getDay() === 0 || d.getDay() === 6
                    return (
                      <div key={d.toISOString()} style={{
                        flex: 1, minWidth: 0,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        borderLeft: '1px solid rgba(0,0,0,0.06)',
                        background: esHoy ? 'rgba(39,174,96,0.1)' : esFinde ? 'rgba(0,0,0,0.02)' : 'transparent'
                      }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: esHoy ? '#27ae60' : '#aaa', textTransform: 'uppercase' }}>
                          {d.toLocaleDateString('es-ES', { weekday: 'short' })}
                        </span>
                        <span style={{ fontSize: '15px', fontWeight: esHoy ? 800 : 600, color: esHoy ? '#27ae60' : '#555' }}>
                          {d.getDate()}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Filas de reservas */}
                {loading ? (
                  <div style={{ padding: '60px', textAlign: 'center' }}><Spinner /></div>
                ) : habitaciones.map((hab, idx) => {
                  const habRes = reservas.filter(r => r.id_habitacion === hab._id && r.estado !== 'Cancelada')
                  return (
                    <div key={hab._id} style={{
                      height: '44px', display: 'flex', position: 'relative',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)'
                    }}>
                      {/* Grid lines verticales */}
                      {dates.map((d, i) => {
                        const esHoy = d.getTime() === hoy.getTime()
                        const esFinde = d.getDay() === 0 || d.getDay() === 6
                        return (
                          <div key={i} style={{
                            flex: 1, minWidth: 0, height: '100%',
                            borderLeft: '1px solid rgba(0,0,0,0.04)',
                            background: esHoy ? 'rgba(39,174,96,0.04)' : esFinde ? 'rgba(0,0,0,0.015)' : 'transparent'
                          }} />
                        )
                      })}

                      {/* Barras de reservas */}
                      {habRes.map(r => {
                        const rStart = new Date(r.fecha_entrada); rStart.setHours(0, 0, 0, 0)
                        const rEnd = new Date(r.fecha_salida); rEnd.setHours(0, 0, 0, 0)

                        if (rEnd <= startDate || rStart >= new Date(endDate.getTime() + MS_PER_DAY)) return null

                        const startOffset = Math.max(0, (rStart.getTime() - startDate.getTime()) / MS_PER_DAY)
                        const endOffset = Math.min(daysToShow, (rEnd.getTime() - startDate.getTime()) / MS_PER_DAY)
                        const leftPct = (startOffset / daysToShow) * 100
                        const widthPct = ((endOffset - startOffset) / daysToShow) * 100

                        const colors = getReservaColor(r.estado, r.estado_pago)
                        const label = getReservaLabel(r.estado, r.estado_pago)

                        return (
                          <div key={r._id}
                            onMouseEnter={(e) => setTooltip({ r, x: e.clientX, y: e.clientY })}
                            onMouseLeave={() => setTooltip(null)}
                            style={{
                              position: 'absolute', top: '5px', bottom: '5px',
                              left: `${leftPct}%`, width: `calc(${widthPct}% - 2px)`,
                              background: colors.bg,
                              borderLeft: `3px solid ${colors.border}`,
                              borderRadius: '4px',
                              padding: '0 6px',
                              display: 'flex', alignItems: 'center', gap: '4px',
                              color: 'white', fontSize: '11px', fontWeight: 700,
                              overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                              cursor: 'pointer',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                              transition: 'opacity 0.15s',
                              zIndex: 1
                            }}
                          >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.nombre_huesped}</span>
                            {widthPct > 20 && <span style={{ opacity: 0.7, fontSize: '10px', fontWeight: 500 }}>· {label}</span>}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* LEYENDA */}
          <div style={{ display: 'flex', gap: '20px', padding: '14px 24px', borderTop: '1px solid rgba(0,0,0,0.08)', background: 'rgba(44,62,80,0.02)', fontSize: '12px', fontWeight: 600, color: '#666' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#95a5a6', border: '1px solid #7f8c8d' }}></div>
              Pendiente
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#f39c12', border: '1px solid #d68910' }}></div>
              Confirmada (Pte. Pago)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#27ae60', border: '1px solid #1e8449' }}></div>
              Pagada
            </div>
          </div>
        </div>

        {/* ─── TABLA DETALLADA ─── */}
        <h3 style={{ fontWeight: 700, color: '#2C3E50', marginBottom: '16px' }}>Listado de Reservas</h3>
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
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{r.habitacion?.numero || 'N/A'}</td>
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

        {/* Tooltip flotante */}
        {tooltip && (
          <div style={{
            position: 'fixed', left: tooltip.x + 12, top: tooltip.y - 10,
            background: '#2c3e50', color: 'white', padding: '10px 14px', borderRadius: '8px',
            fontSize: '12px', zIndex: 300, pointerEvents: 'none',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)', maxWidth: '240px', lineHeight: 1.5
          }}>
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>{tooltip.r.nombre_huesped}</div>
            <div>📅 {formatDate(tooltip.r.fecha_entrada)} → {formatDate(tooltip.r.fecha_salida)}</div>
            <div>🏷️ {getReservaLabel(tooltip.r.estado, tooltip.r.estado_pago)}</div>
            {tooltip.r.precio_total && <div>💰 {formatEuros(tooltip.r.precio_total)}</div>}
          </div>
        )}
      </main>
    </div>
  )
}
