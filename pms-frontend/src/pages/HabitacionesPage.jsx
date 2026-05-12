import Navbar from '../layouts/Navbar'
import Spinner from '../components/Spinner'
import HabitacionCard from '../components/HabitacionCard'
import { useHabitaciones } from '../hooks/useHabitaciones'

// Listado de todas las habitaciones con filtros
export default function HabitacionesPage() {
  const { habitaciones, loading } = useHabitaciones()

  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Habitaciones</h2>
        {/* TODO: aÃ±adir filtros por estado y tipo */}
        {loading ? <Spinner /> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {habitaciones.map(h => <HabitacionCard key={h._id} habitacion={h} />)}
          </div>
        )}
      </main>
    </div>
  )
}