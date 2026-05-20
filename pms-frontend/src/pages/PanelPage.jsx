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
        const hoy = new Date().toISOString().slice(0, 10)

        const totalHabs = habs.length

        const activas = reservas.filter(r => r.estado !== 'Cancelada')

        const idsOcupadas = new Set()
        activas.forEach(r => {
          if (r.fecha_entrada <= hoy && r.fecha_salida >= hoy) {
            idsOcupadas.add(r.id_habitacion)
          }
        })
        const ocupadas = idsOcupadas.size
        const disponibles = totalHabs - ocupadas

        const llegadasHoy = activas.filter(r => r.fecha_entrada === hoy).length

        const salidasHoy = activas.filter(r => r.fecha_salida === hoy).length

        const aLimpiar = habs.filter(h => h.estado_limpieza !== 'Limpia').length

        const reservasHoy = activas.filter(r =>
          r.fecha_entrada <= hoy && r.fecha_salida >= hoy
        ).length

        setStats({
          totalHabs,
          ocupadas,
          disponibles,
          aLimpiar,
          reservasHoy,
          llegadasHoy,
          salidasHoy,
          ocupacionPct: totalHabs > 0 ? Math.round((ocupadas / totalHabs) * 100) : 0,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const ProgressBar = ({ value, max, color }) => {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0
    return (
      <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.06)', borderRadius: '10px', marginTop: '12px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '10px', transition: 'width 0.6s ease' }}></div>
      </div>
    )
  }

  const StatCard = ({ icon, label, value, sub, color, progress }) => (
    <div className="glass" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#666', fontWeight: 600 }}>{label}</p>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      </div>
      <div>
        <p style={{ margin: '8px 0 0', fontSize: '2.8rem', fontWeight: 800, color: color, lineHeight: 1 }}>
          {value}
          {sub && <span style={{ fontSize: '14px', fontWeight: 400, color: '#aaa', marginLeft: '4px' }}>{sub}</span>}
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
          Aquí tienes el resumen del día de hoy.
        </p>

        {loading ? <Spinner /> : stats && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
              <StatCard icon="🏨" label="Total habitaciones" value={stats.totalHabs} color="#2C3E50" />
              <StatCard icon="🚫" label="Ocupadas" value={stats.ocupadas} sub={`/ ${stats.totalHabs}`} color="#e74c3c"
                progress={{ value: stats.ocupadas, max: stats.totalHabs }} />
              <StatCard icon="✅" label="Disponibles" value={stats.disponibles} sub={`/ ${stats.totalHabs}`} color="#2ECC71"
                progress={{ value: stats.disponibles, max: stats.totalHabs }} />
              <StatCard icon="🧹" label="Habitaciones sucias" value={stats.aLimpiar} sub={`/ ${stats.totalHabs}`} color="#f39c12"
                progress={{ value: stats.aLimpiar, max: stats.totalHabs }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              <StatCard icon="📋" label="Reservas hoy" value={stats.reservasHoy} color="#2C3E50" />
              <StatCard icon="🛬" label="Llegadas" value={stats.llegadasHoy} color="#3498db" />
              <StatCard icon="🛫" label="Salidas" value={stats.salidasHoy} color="#9b59b6" />
              <StatCard icon="📊" label="Ocupación del hotel" value={`${stats.ocupacionPct}%`} color="#8E44AD"
                progress={{ value: stats.ocupadas, max: stats.totalHabs }} />
            </div>
          </>
        )}
      </main>
    </div>
  )
}