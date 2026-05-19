import { useState } from 'react'
import Navbar from '../layouts/Navbar'
import Spinner from '../components/Spinner'
import Badge from '../components/Badge'
import { useReservas } from '../hooks/useReservas'
import { confirmarReserva, cancelarReserva, pagarReserva } from '../services/reservas.service'
import { formatDate, formatEuros } from '../utils/formatDate'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ReservasPage() {
  const { reservas, loading } = useReservas()
  const { usuario } = useAuth()
  const esCliente = usuario?.rol === 'cliente'
  const nav = useNavigate()
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
      if (data.factura?._id) nav(`/facturas/${data.factura._id}`)
      else window.location.reload()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al procesar el pago')
    } finally { setPagando(false) }
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
                {['Huesped','Habitacion','Entrada','Salida','Total','Estado','Pago','Acciones'].map(h=>(
                  <th key={h} style={{ padding:'14px 16px',textAlign:'left',fontWeight:600,color:'#2C3E50',opacity:0.7 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reservas.length===0?(
                <tr><td colSpan="8" style={{padding:'40px',textAlign:'center',color:'#999'}}>No hay reservas todavia.</td></tr>
              ):reservas.map(r=>(
                <tr key={r._id} style={{borderBottom:'1px solid rgba(0,0,0,0.04)'}}>
                  <td style={{padding:'14px 16px'}}>{r.nombre_huesped}</td>
                  <td style={{padding:'14px 16px'}}>{r.id_habitacion}</td>
                  <td style={{padding:'14px 16px'}}>{formatDate(r.fecha_entrada)}</td>
                  <td style={{padding:'14px 16px'}}>{formatDate(r.fecha_salida)}</td>
                  <td style={{padding:'14px 16px',fontWeight:600}}>{formatEuros(r.precio_total)}</td>
                  <td style={{padding:'14px 16px'}}><Badge estado={r.estado}/></td>
                  <td style={{padding:'14px 16px'}}><Badge estado={r.estado_pago||'pendiente'}/></td>
                  <td style={{padding:'14px 16px'}}>
                    <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                      {r.estado==='Pendiente'&&!esCliente&&<button onClick={()=>handleConfirmar(r._id)} className="btn-primary" style={{padding:'6px 14px',fontSize:'12px'}}>Confirmar</button>}
                      {r.estado_pago!=='pagado'&&r.estado!=='Cancelada'&&(
                        <button onClick={()=>{setModalPago(r);setMetodoPago('tarjeta')}} style={{padding:'6px 14px',fontSize:'12px',background:'#2ECC71',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:600}}>Pagar</button>
                      )}
                      {r.estado!=='Cancelada'&&<button onClick={()=>handleCancelar(r._id)} style={{padding:'6px 14px',fontSize:'12px',background:'transparent',border:'1px solid #e74c3c',color:'#e74c3c',borderRadius:'8px',cursor:'pointer'}}>Cancelar</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de pago */}
      {modalPago&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.3)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'20px'}}>
          <div className="glass" style={{width:'100%',maxWidth:'420px',padding:'32px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
              <h3 style={{margin:0,fontWeight:700}}>Pagar reserva</h3>
              <button onClick={()=>setModalPago(null)} style={{background:'none',border:'none',fontSize:'24px',cursor:'pointer',color:'#999'}}>&times;</button>
            </div>
            <div style={{background:'rgba(46,204,113,0.06)',borderRadius:'12px',padding:'16px',marginBottom:'20px'}}>
              <p style={{margin:'0 0 8px',fontSize:'13px',color:'#666'}}>Huesped: <strong>{modalPago.nombre_huesped}</strong></p>
              <p style={{margin:'0 0 8px',fontSize:'13px',color:'#666'}}>{formatDate(modalPago.fecha_entrada)} → {formatDate(modalPago.fecha_salida)}</p>
              {modalPago.servicios_pedidos&&modalPago.servicios_pedidos.length>0&&(
                <div style={{marginBottom:'8px'}}>
                  <p style={{margin:'0 0 4px',fontSize:'12px',color:'#999',fontWeight:600}}>Servicios:</p>
                  {modalPago.servicios_pedidos.map((s,i)=>(
                    <p key={i} style={{margin:'0 0 2px',fontSize:'12px',color:'#666'}}>{s.nombre} x{s.cantidad} — {formatEuros(s.precio*s.cantidad)}</p>
                  ))}
                </div>
              )}
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'1.1rem',fontWeight:700,color:'#2ECC71',marginTop:'8px',paddingTop:'8px',borderTop:'1px solid rgba(0,0,0,0.08)'}}>
                <span>Total</span><span>{formatEuros(modalPago.precio_total)}</span>
              </div>
            </div>
            <div style={{marginBottom:'24px'}}>
              <label className="input-label">Metodo de pago</label>
              <div style={{display:'flex',gap:'10px'}}>
                {[{value:'tarjeta',label:'💳 Tarjeta'},{value:'efectivo',label:'💵 Efectivo'},{value:'transferencia',label:'🏦 Transferencia'}].map(m=>(
                  <button key={m.value} type="button" onClick={()=>setMetodoPago(m.value)} style={{flex:1,padding:'12px',fontSize:'13px',fontWeight:600,border:metodoPago===m.value?'2px solid #2ECC71':'1px solid rgba(0,0,0,0.1)',background:metodoPago===m.value?'rgba(46,204,113,0.08)':'rgba(255,255,255,0.6)',color:metodoPago===m.value?'#27AE60':'#666',borderRadius:'10px',cursor:'pointer',transition:'all 0.2s'}}>{m.label}</button>
                ))}
              </div>
            </div>
            <button onClick={handlePagar} disabled={pagando} className="btn-primary" style={{width:'100%'}}>{pagando?'Procesando...':`Pagar ${formatEuros(modalPago.precio_total)}`}</button>
          </div>
        </div>
      )}
    </div>
  )
}
