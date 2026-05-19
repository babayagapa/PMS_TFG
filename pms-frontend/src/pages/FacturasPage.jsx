import { Link } from 'react-router-dom'
import Navbar from '../layouts/Navbar'
import Spinner from '../components/Spinner'
import { useFacturas } from '../hooks/useFacturas'
import { formatDate, formatEuros } from '../utils/formatDate'

export default function FacturasPage() {
  const { facturas, loading } = useFacturas()

  return (
    <div className="page">
      <Navbar />
      <h2 style={{ margin:'0 0 24px',fontSize:'1.8rem',fontWeight:700 }}>Facturas</h2>
      {loading ? <Spinner /> : facturas.length===0 ? (
        <div className="glass" style={{padding:'60px',textAlign:'center'}}>
          <p style={{color:'#999',fontSize:'15px'}}>No hay facturas todavia.</p>
          <p style={{color:'#bbb',fontSize:'13px',marginTop:'8px'}}>Las facturas se generan automaticamente al pagar una reserva.</p>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))',gap:'20px'}}>
          {facturas.map(f=>(
            <Link key={f._id} to={`/facturas/${f._id}`} style={{textDecoration:'none',color:'inherit'}}>
              <div className="glass" style={{padding:'24px',transition:'box-shadow 0.2s',cursor:'pointer'}}
                onMouseEnter={e=>e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.10)'}
                onMouseLeave={e=>e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.05)'}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}>
                  <div>
                    <p style={{margin:0,fontWeight:700,fontSize:'15px',color:'#2C3E50'}}>{f.numero_factura}</p>
                    <p style={{margin:'2px 0 0',fontSize:'12px',color:'#999'}}>{formatDate(f.fecha)}</p>
                  </div>
                  <span style={{fontSize:'11px',background:'rgba(46,204,113,0.1)',color:'#27AE60',padding:'3px 10px',borderRadius:'20px',border:'1px solid rgba(46,204,113,0.2)',fontWeight:600}}>{f.metodo_pago}</span>
                </div>
                <p style={{margin:'0 0 4px',fontSize:'13px',color:'#666'}}>{f.datos_cliente?.nombre}</p>
                <p style={{margin:'0 0 12px',fontSize:'12px',color:'#aaa'}}>{f.datos_cliente?.email}</p>
                <div style={{borderTop:'1px solid rgba(0,0,0,0.06)',paddingTop:'12px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px',color:'#666',marginBottom:'4px'}}><span>Base imponible</span><span>{formatEuros(f.base_imponible)}</span></div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px',color:'#666',marginBottom:'4px'}}><span>IVA ({f.porcentaje_iva}%)</span><span>{formatEuros(f.importe_iva)}</span></div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'1.1rem',fontWeight:700,color:'#2ECC71',marginTop:'8px',paddingTop:'8px',borderTop:'1px solid rgba(0,0,0,0.06)'}}><span>Total</span><span>{formatEuros(f.total)}</span></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
