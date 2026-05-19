import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../layouts/Navbar'
import Spinner from '../components/Spinner'
import { getFactura } from '../services/facturas.service'
import { formatDate, formatEuros } from '../utils/formatDate'
import toast from 'react-hot-toast'

export default function FacturaDetallePage() {
  const { id } = useParams()
  const [factura, setFactura] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFactura(id)
      .then(({ data }) => setFactura(data))
      .catch(() => toast.error('Error al cargar la factura'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page"><Navbar /><Spinner /></div>
  if (!factura) return <div className="page"><Navbar /><p style={{textAlign:'center',color:'#999',padding:'60px'}}>Factura no encontrada.</p></div>

  return (
    <div className="page">
      <Navbar />
      <div style={{maxWidth:'680px',margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
          <div>
            <h2 style={{margin:0,fontSize:'1.8rem',fontWeight:700}}>Factura</h2>
            <p style={{margin:'4px 0 0',color:'#999',fontSize:'14px'}}>{factura.numero_factura}</p>
          </div>
          <Link to="/facturas" style={{color:'#2ECC71',fontWeight:600,fontSize:'14px',textDecoration:'none'}}>← Volver a facturas</Link>
        </div>
        <div className="glass" style={{padding:'40px'}}>
          {/* Datos hotel y cliente */}
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'32px'}}>
            <div>
              <p style={{margin:'0 0 4px',fontWeight:700,color:'#2C3E50'}}>{factura.datos_hotel?.nombre}</p>
              <p style={{margin:'0 0 2px',fontSize:'13px',color:'#666'}}>CIF: {factura.datos_hotel?.cif}</p>
              <p style={{margin:'0 0 2px',fontSize:'13px',color:'#666'}}>{factura.datos_hotel?.direccion}</p>
              <p style={{margin:'0 0 2px',fontSize:'13px',color:'#666'}}>{factura.datos_hotel?.telefono}</p>
              <p style={{margin:0,fontSize:'13px',color:'#666'}}>{factura.datos_hotel?.email}</p>
            </div>
            <div style={{textAlign:'right'}}>
              <p style={{margin:'0 0 4px',fontWeight:700,color:'#2C3E50'}}>Cliente</p>
              <p style={{margin:'0 0 2px',fontSize:'13px',color:'#666'}}>{factura.datos_cliente?.nombre}</p>
              <p style={{margin:'0 0 2px',fontSize:'13px',color:'#666'}}>NIF: {factura.datos_cliente?.nif||'—'}</p>
              <p style={{margin:'0 0 2px',fontSize:'13px',color:'#666'}}>{factura.datos_cliente?.email}</p>
              <p style={{margin:0,fontSize:'13px',color:'#666'}}>{factura.datos_cliente?.telefono||'—'}</p>
            </div>
          </div>
          {/* Info factura */}
          <div style={{display:'flex',gap:'24px',marginBottom:'28px',padding:'16px',background:'rgba(46,204,113,0.05)',borderRadius:'10px'}}>
            <div><p style={{margin:'0 0 2px',fontSize:'12px',color:'#999',fontWeight:600}}>FECHA</p><p style={{margin:0,fontSize:'14px',fontWeight:600}}>{formatDate(factura.fecha)}</p></div>
            <div><p style={{margin:'0 0 2px',fontSize:'12px',color:'#999',fontWeight:600}}>METODO DE PAGO</p><p style={{margin:0,fontSize:'14px',fontWeight:600,textTransform:'capitalize'}}>{factura.metodo_pago}</p></div>
            <div><p style={{margin:'0 0 2px',fontSize:'12px',color:'#999',fontWeight:600}}>Nº FACTURA</p><p style={{margin:0,fontSize:'14px',fontWeight:600}}>{factura.numero_factura}</p></div>
          </div>
          {/* Tabla lineas */}
          <table style={{width:'100%',borderCollapse:'collapse',marginBottom:'24px',fontSize:'14px'}}>
            <thead>
              <tr style={{borderBottom:'2px solid rgba(0,0,0,0.08)'}}>
                <th style={{padding:'10px 0',textAlign:'left',fontWeight:600,color:'#2C3E50',opacity:0.7}}>Concepto</th>
                <th style={{padding:'10px 0',textAlign:'center',fontWeight:600,color:'#2C3E50',opacity:0.7}}>Cant.</th>
                <th style={{padding:'10px 0',textAlign:'right',fontWeight:600,color:'#2C3E50',opacity:0.7}}>Precio unit.</th>
                <th style={{padding:'10px 0',textAlign:'right',fontWeight:600,color:'#2C3E50',opacity:0.7}}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {(factura.lineas||[]).map((l,i)=>(
                <tr key={i} style={{borderBottom:'1px solid rgba(0,0,0,0.04)'}}>
                  <td style={{padding:'12px 0',color:'#2C3E50'}}>{l.concepto}</td>
                  <td style={{padding:'12px 0',textAlign:'center',color:'#666'}}>{l.cantidad}</td>
                  <td style={{padding:'12px 0',textAlign:'right',color:'#666'}}>{formatEuros(l.precio_unitario)}</td>
                  <td style={{padding:'12px 0',textAlign:'right',fontWeight:600,color:'#2C3E50'}}>{formatEuros(l.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Totales */}
          <div style={{borderTop:'2px solid rgba(0,0,0,0.08)',paddingTop:'16px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',fontSize:'14px',color:'#666'}}><span>Base imponible</span><span>{formatEuros(factura.base_imponible)}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',fontSize:'14px',color:'#666'}}><span>IVA ({factura.porcentaje_iva}%)</span><span>{formatEuros(factura.importe_iva)}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:'12px',paddingTop:'12px',borderTop:'2px solid rgba(46,204,113,0.3)',fontSize:'1.3rem',fontWeight:800,color:'#2ECC71'}}><span>Total</span><span>{formatEuros(factura.total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
