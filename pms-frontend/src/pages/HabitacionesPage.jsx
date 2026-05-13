import { useState } from 'react'
import Navbar from '../layouts/Navbar'
import Spinner from '../components/Spinner'
import HabitacionCard from '../components/HabitacionCard'
import { useHabitaciones } from '../hooks/useHabitaciones'

export default function HabitacionesPage() {
  const [tipo, setTipo]       = useState('')
  const [ocupada, setOcupada] = useState('')

  const filtros = {}
  if (tipo)    filtros.tipo   = tipo
  if (ocupada !== '') filtros.ocupada = ocupada

  const { habitaciones, loading } = useHabitaciones(filtros)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-4">Habitaciones</h2>

        <div className="flex gap-3 mb-6">
          <select
            className="border rounded p-2 text-sm"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="Individual">Individual</option>
            <option value="Doble">Doble</option>
            <option value="Suite">Suite</option>
            <option value="Familiar">Familiar</option>
          </select>

          <select
            className="border rounded p-2 text-sm"
            value={ocupada}
            onChange={(e) => setOcupada(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="false">Solo disponibles</option>
            <option value="true">Solo ocupadas</option>
          </select>
        </div>

        {loading ? (
          <Spinner />
        ) : habitaciones.length === 0 ? (
          <p className="text-gray-500">No hay habitaciones con esos filtros.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {habitaciones.map((h) => (
              <HabitacionCard key={h._id} habitacion={h} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
