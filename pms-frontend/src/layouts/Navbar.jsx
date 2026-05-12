import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Barra de navegaciÃ³n superior
export default function Navbar() {
  const { usuario, logout } = useAuth() || {}
  return (
    <nav className="bg-primary text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">PMS Hotel</Link>
      <div className="flex gap-4 text-sm">
        <Link to="/habitaciones">Habitaciones</Link>
        {usuario ? (
          <>
            <Link to="/panel">Panel</Link>
            <button onClick={logout}>Salir</button>
          </>
        ) : (
          <Link to="/login">Entrar</Link>
        )}
      </div>
    </nav>
  )
}