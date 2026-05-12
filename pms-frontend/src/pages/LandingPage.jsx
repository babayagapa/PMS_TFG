import { Link } from 'react-router-dom'
import Navbar from '../layouts/Navbar'

// PÃ¡gina principal con presentaciÃ³n del hotel y acceso rÃ¡pido
export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <main className="p-8">
        <h1 className="text-3xl font-bold text-primary">Hotel PMS</h1>
        <p className="mt-2 text-gray-600">Sistema de gestiÃ³n de habitaciones y reservas.</p>
        <div className="mt-6 flex gap-4">
          <Link to="/habitaciones" className="bg-primary text-white px-4 py-2 rounded">
            Ver habitaciones
          </Link>
          <Link to="/reservas/nueva" className="bg-secondary text-white px-4 py-2 rounded">
            Nueva reserva
          </Link>
        </div>
        {/* TODO: aÃ±adir secciÃ³n con habitaciones destacadas desde la API */}
      </main>
    </div>
  )
}