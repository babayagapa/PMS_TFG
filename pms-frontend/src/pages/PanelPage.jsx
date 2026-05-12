import Sidebar from '../layouts/Sidebar'

// Dashboard del panel de recepciÃ³n
export default function PanelPage() {
  // TODO: cargar estadÃ­sticas: habitaciones ocupadas, reservas del dÃ­a
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Dashboard</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* TODO: tarjetas con ocupaciÃ³n, reservas pendientes, ingresos */}
          <div className="bg-white border rounded p-4">Habitaciones ocupadas: cargando...</div>
          <div className="bg-white border rounded p-4">Reservas hoy: cargando...</div>
          <div className="bg-white border rounded p-4">Pendientes de confirmar: cargando...</div>
        </div>
      </main>
    </div>
  )
}