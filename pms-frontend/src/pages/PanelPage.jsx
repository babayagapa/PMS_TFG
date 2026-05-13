import { useEffect, useState } from 'react'
import Sidebar from '../layouts/Sidebar'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { getHabitaciones } from '../services/habitaciones.service'
import { getReservas } from '../services/reservas.service'

export default function PanelPage() {
  const { usuario } = useAuth()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getHabitaciones(),
      getReservas(),
    ]).then(([habRes, resRes]) => {
      const habs = habRes.data
      const reservas = resRes.data
      setStats({
        total:       habs.length,
        ocupadas:    habs.filter((h) => h.ocupada).length,
        disponibles: habs.filter((h) => !h.ocupada).length,
        pendientes:  reservas.filter((r) => r.estado === 'Pendiente').length,
        confirmadas: reservas.filter((r) => r.estado === 'Confirmada').length,
        totalReservas: reservas.length,
      })
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Hola, {usuario?.nombre || 'Recepcionista'}
        </h2>
        <p className="text-gray-500 text-sm mb-6">Panel de control</p>

        {loading ? <Spinner /> : stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded shadow p-4">
              <p className="text-sm text-gray-500">Habitaciones totales</p>
              <p className="text-3xl font-bold text-primary">{stats.total}</p>
            </div>
            <div className="bg-white rounded shadow p-4">
              <p className="text-sm text-gray-500">Ocupadas</p>
              <p className="text-3xl font-bold text-red-500">{stats.ocupadas}</p>
            </div>
            <div className="bg-white rounded shadow p-4">
              <p className="text-sm text-gray-500">Disponibles</p>
              <p className="text-3xl font-bold text-green-500">{stats.disponibles}</p>
            </div>
            <div className="bg-white rounded shadow p-4">
              <p className="text-sm text-gray-500">Reservas totales</p>
              <p className="text-3xl font-bold text-primary">{stats.totalReservas}</p>
            </div>
            <div className="bg-white rounded shadow p-4">
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-500">{stats.pendientes}</p>
            </div>
            <div className="bg-white rounded shadow p-4">
              <p className="text-sm text-gray-500">Confirmadas</p>
              <p className="text-3xl font-bold text-green-500">{stats.confirmadas}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
