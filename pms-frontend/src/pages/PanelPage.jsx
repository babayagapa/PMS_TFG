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
        const habs    = habRes.data
        const reservas = resRes.data
        setStats({
          total:        habs.length,
          ocupadas:     habs.filter(h => h.ocupada).length,
          disponibles:  habs.filter(h => !h.ocupada).length,
          pendientes:   reservas.filter(r => r.estado === 'Pendiente').length,
          confirmadas:  reservas.filter(r => r.estado === 'Confirmada').length,
          totalReservas: reservas.length,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const StatCard = ({ label, value, color }) => (
    <div className="glass rounded-2xl p-5 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-4xl font-extrabold ${color}`}>{value}</p>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 px-8 py-8">
        <h2 className="text-2xl font-bold text-dark mb-1">
          Hola, {usuario?.nombre || 'Recepcionista'}
        </h2>
        <p className="text-gray-500 text-sm mb-8">Panel de control</p>

        {loading ? <Spinner /> : stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total habitaciones" value={stats.total}        color="text-dark" />
            <StatCard label="Ocupadas"           value={stats.ocupadas}     color="text-red-500" />
            <StatCard label="Disponibles"        value={stats.disponibles}  color="text-primary" />
            <StatCard label="Total reservas"     value={stats.totalReservas} color="text-dark" />
            <StatCard label="Pendientes"         value={stats.pendientes}   color="text-yellow-500" />
            <StatCard label="Confirmadas"        value={stats.confirmadas}  color="text-primary" />
          </div>
        )}
      </main>
    </div>
  )
}
