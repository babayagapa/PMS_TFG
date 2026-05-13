import Sidebar from '../layouts/Sidebar'

// Dashboard del panel de recepción
export default function PanelPage() {
  // TODO: cargar estadísticas: habitaciones ocupadas, reservas del día
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Dashboard</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* TODO: tarjetas con ocupación, reservas pendientes, ingresos */}
          <div className="bg-white border rounded p-4">Habitaciones ocupadas: cargando...</div>
          <div className="bg-white border rounded p-4">Reservas hoy: cargando...</div>
          <div className="bg-white border rounded p-4">Pendientes de confirmar: cargando...</div>
        </div>
      </main>
    </div>
  )
}