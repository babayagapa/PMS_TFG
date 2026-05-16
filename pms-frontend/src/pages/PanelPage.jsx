import { useEffect, useState } from 'react'
import Sidebar from '../layouts/Sidebar'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { getHabitaciones } from '../services/habitaciones.service'
import { getReservas } from '../services/reservas.service'

export default function PanelPage() {
  const { usuario } = useAuth()
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getHabitaciones(), getReservas()])
      .then(([habRes, resRes]) => {
        const habs     = habRes.data
        const reservas = resRes.data
        setStats({
          total:         habs.length,
          ocupadas:      habs.filter(h => h.ocupada).length,
          disponibles:   habs.filter(h => !h.ocupada).length,
          pendientes:    reservas.filter(r => r.estado === 'Pendiente').length,
          confirmadas:   reservas.filter(r => r.estado === 'Confirmada').length,
          totalReservas: reservas.length,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '1.8rem', fontWeight: 700 }}>
          Hola, {usuario?.nombre || 'Recepcionista'}
        </h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '32px' }}>Panel de control</p>

        {loading ? <Spinner /> : stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { label: 'Total habitaciones', value: stats.total,         color: '#2C3E50' },
              { label: 'Ocupadas',           value: stats.ocupadas,      color: '#e74c3c' },
              { label: 'Disponibles',        value: stats.disponibles,   color: '#2ECC71' },
              { label: 'Total reservas',     value: stats.totalReservas, color: '#2C3E50' },
              { label: 'Pendientes',         value: stats.pendientes,    color: '#f39c12' },
              { label: 'Confirmadas',        value: stats.confirmadas,   color: '#2ECC71' },
            ].map(s => (
              <div key={s.label} className="glass" style={{ padding: '24px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#666' }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
