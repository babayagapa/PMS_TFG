import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { usuario, logout } = useAuth() || {}
  const nav = useNavigate()

  const handleLogout = async () => {
    await logout()
    nav('/login')
  }

  return (
    <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl text-dark">
        Hotel PMS
      </Link>

      <div className="flex gap-6 text-sm items-center text-dark">
        <Link to="/" className="hover:text-primary transition-colors font-medium">
          Inicio
        </Link>
        <Link to="/habitaciones" className="hover:text-primary transition-colors font-medium">
          Habitaciones
        </Link>

        {usuario ? (
          <>
            <Link to="/reservas" className="hover:text-primary transition-colors font-medium">
              Reservas
            </Link>
            <Link to="/panel" className="hover:text-primary transition-colors font-medium">
              Panel
            </Link>
            <span className="text-gray-400 text-xs border-l pl-4">{usuario.nombre}</span>
            <button
              onClick={handleLogout}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Salir
            </button>
          </>
        ) : (
          <>
            <Link to="/contacto" className="hover:text-primary transition-colors font-medium">
              Contacto
            </Link>
            <Link
              to="/login"
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Entrar
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}