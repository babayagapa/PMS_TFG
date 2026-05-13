import Navbar from '../layouts/Navbar'
import ReservaForm from '../components/ReservaForm'

export default function ReservaFormPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-6">Nueva reserva</h2>
        <div className="bg-white rounded shadow p-6">
          <ReservaForm />
        </div>
      </main>
    </div>
  )
}
