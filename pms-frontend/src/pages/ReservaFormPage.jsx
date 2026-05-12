import Navbar from '../layouts/Navbar'
import ReservaForm from '../components/ReservaForm'

// PÃ¡gina que contiene el formulario de nueva reserva
export default function ReservaFormPage() {
  // TODO: leer ?habitacion_id de la URL para preseleccionar habitaciÃ³n
  return (
    <div>
      <Navbar />
      <main className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-4">Nueva reserva</h2>
        <ReservaForm />
      </main>
    </div>
  )
}