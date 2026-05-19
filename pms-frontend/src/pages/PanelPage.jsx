import { useEffect, useState } from 'react'
import Sidebar from '../layouts/Sidebar'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { getHabitaciones } from '../services/habitaciones.service'
import { getReservas } from '../services/reservas.service'

export default function PanelPage() {
  const { usuario } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getHabitaciones(), getReservas()])
      .then(([habRes, resRes]) => {
        const habs = habRes.data
        const reservas = resRes.data
        const ocupadas = habs.filter(h => h.ocupada).length
        const disponibles = habs.filter(h => !h.ocupada).length
        const limpias = habs.filter(h => !h.ocupada && h.estado_limpieza === 'Limpia').length
        const sucias = habs.filter(h => !h.ocupada && h.estado_limpieza !== 'Limpia').length
        setStats({
          total: habs.length,
          ocupadas,
          disponibles,
          limpias,
          sucias,
          pendientes: reservas.filter(r => r.estado === 'Pendiente').length,
          confirmadas: reservas.filter(r => r.estado === 'Confirmada').length,
          totalReservas: reservas.length,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const ProgressBar = ({ value, max, color }) => {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0
    return (
      <div style={{width:'100%',height:'8px',background:'rgba(0,0,0,0.06)',borderRadius:'10px',marginTop:'12px',overflow:'hidden'}}>
        <div style={{height:'100%',width:`${pct}%`,background:color,borderRadius:'10px',transition:'width 0.6s ease'}}></div>
      </div>
    )
  }

  const StatCard = ({ icon, label, value, sub, color, progress }) => (
    <div className="glass" style={{padding:'28px',display:'flex',flexDirection:'column',justifyContent:'space-between',minHeight:'160px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <p style={{margin:0,fontSize:'13px',color:'#666',fontWeight:600}}>{label}</p>
        <span style={{fontSize:'1.5rem'}}>{icon}</span>
      </div>
      <div>
        <p style={{margin:'8px 0 0',fontSize:'2.8rem',fontWeight:800,color:color,lineHeight:1}}>
          {value}
          {sub && <span style={{fontSize:'14px',fontWeight:400,color:'#aaa',marginLeft:'4px'}}>{sub}</span>}
        </p>
        {progress && <ProgressBar value={progress.value} max={progress.max} color={color} />}
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '1.8rem', fontWeight: 700 }}>
          Hola, {usuario?.nombre || 'Usuario'}
        </h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '32px' }}>
          Aqui tienes un resumen de la actividad del hotel hoy.
        </p>

        {loading ? <Spinner /> : stats && (
          <>
            {/* Fila 1: Habitaciones */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'20px',marginBottom:'20px'}}>
              <StatCard icon="🏨" label="Total Habitaciones" value={stats.total} color="#2C3E50" />
              <StatCard icon="🚫" label="Ocupadas" value={stats.ocupadas} sub={`/ ${stats.total}`} color="#e74c3c"
                progress={{value:stats.ocupadas,max:stats.total}} />
              <StatCard icon="✅" label="Disponibles" value={stats.disponibles} color="#2ECC71"
                progress={{value:stats.disponibles,max:stats.total}} />
            </div>

            {/* Fila 2: Limpieza */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'20px',marginBottom:'20px'}}>
              <StatCard icon="🧹" label="Habitaciones vacias limpias" value={stats.limpias} sub={`/ ${stats.disponibles}`} color="#27AE60"
                progress={{value:stats.limpias,max:stats.disponibles}} />
              <StatCard icon="⚠️" label="Habitaciones vacias sucias" value={stats.sucias} sub={`/ ${stats.disponibles}`} color="#f39c12"
                progress={{value:stats.sucias,max:stats.disponibles}} />
              <StatCard icon="📊" label="Ocupacion del hotel" value={`${stats.total > 0 ? Math.round((stats.ocupadas / stats.total) * 100) : 0}%`} color="#8E44AD"
                progress={{value:stats.ocupadas,max:stats.total}} />
            </div>

            {/* Fila 3: Reservas */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'20px'}}>
              <StatCard icon="📋" label="Total Reservas" value={stats.totalReservas} color="#2C3E50" />
              <StatCard icon="⏳" label="Pendientes" value={stats.pendientes} color="#f39c12"
                progress={{value:stats.pendientes,max:stats.totalReservas}} />
              <StatCard icon="✅" label="Confirmadas" value={stats.confirmadas} color="#2ECC71"
                progress={{value:stats.confirmadas,max:stats.totalReservas}} />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
