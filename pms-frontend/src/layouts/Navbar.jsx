import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { usuario, logout } = useAuth() || {}

  return (
    <nav className="bg-dark text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg text-primary">PMS Hotel</Link>
      <div className="flex gap-5 text-sm items-center">
        <Link to="/habitaciones" className="hover:text-primary transition-colors">
          Habitaciones
        </Link>
        {usuario ? (
          <>
            <Link to="/reservas" className="hover:text-primary transition-colors">
              Reservas
            </Link>
            <Link to="/panel" className="hover:text-primary transition-colors">
              Panel
            </Link>
            <span className="text-gray-400 text-xs">{usuario.nombre}</span>
            <button
              onClick={logout}
              className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-dark transition-colors"
            >
              Salir
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-dark transition-colors"
          >
            Entrar
          </Link>
        )}
      </div>
    </nav>
  )
}