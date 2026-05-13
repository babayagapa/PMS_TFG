import { Link } from 'react-router-dom'
import Navbar from '../layouts/Navbar'
import HabitacionCard from '../components/HabitacionCard'
import Spinner from '../components/Spinner'
import { useHabitaciones } from '../hooks/useHabitaciones'

export default function LandingPage() {
  const { habitaciones, loading } = useHabitaciones()
  const destacadas = habitaciones.filter((h) => !h.ocupada).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-primary text-white py-16 px-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Bienvenido al Hotel PMS</h1>
        <p className="text-lg mb-8 opacity-90">Gestiona reservas y habitaciones desde un solo lugar</p>
        <div className="flex justify-center gap-4">
          <Link to="/habitaciones" className="bg-secondary text-white px-6 py-3 rounded font-medium hover:bg-yellow-600 transition-colors">
            Ver habitaciones
          </Link>
          <Link to="/login" className="border border-white text-white px-6 py-3 rounded font-medium hover:bg-white hover:text-primary transition-colors">
            Panel de recepcion
          </Link>
        </div>
      </section>

      <section className="py-12 px-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-6">Habitaciones disponibles</h2>
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destacadas.map((h) => (
              <HabitacionCard key={h._id} habitacion={h} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
