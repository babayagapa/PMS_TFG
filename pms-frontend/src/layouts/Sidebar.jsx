import { NavLink } from 'react-router-dom'

// Sidebar del panel de recepciÃ³n
export default function Sidebar() {
  return (
    <aside className="w-48 bg-primary text-white min-h-screen p-4">
      <p className="font-bold mb-6">Panel</p>
      <nav className="flex flex-col gap-2 text-sm">
        <NavLink to="/panel">Dashboard</NavLink>
        <NavLink to="/habitaciones">Habitaciones</NavLink>
        <NavLink to="/reservas">Reservas</NavLink>
      </nav>
    </aside>
  )
}