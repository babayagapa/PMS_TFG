import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { usuario } = useAuth() || {}

  const base    = 'block px-3 py-2 rounded text-sm transition-colors'
  const activo  = `${base} bg-primary text-white font-medium`
  const inactivo= `${base} text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10`

  return (
    <aside className="w-48 bg-dark text-white min-h-screen p-4 flex-shrink-0">
      <p className="font-bold text-primary text-lg mb-1">Panel</p>
      {usuario && <p className="text-xs text-gray-400 mb-6">{usuario.nombre}</p>}
      <nav className="flex flex-col gap-1">
        <NavLink to="/panel"        className={({ isActive }) => isActive ? activo : inactivo}>Dashboard</NavLink>
        <NavLink to="/habitaciones" className={({ isActive }) => isActive ? activo : inactivo}>Habitaciones</NavLink>
        <NavLink to="/reservas"     className={({ isActive }) => isActive ? activo : inactivo}>Reservas</NavLink>
        <NavLink to="/facturas"     className={({ isActive }) => isActive ? activo : inactivo}>Facturas</NavLink>
      </nav>
    </aside>
  )
}