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
    <nav className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', marginBottom: '40px', position: 'sticky', top: '20px', zIndex: 100 }}>
      <Link to="/" style={{ fontWeight: 700, fontSize: '24px', color: '#2C3E50', textDecoration: 'none' }}>Hotel PMS</Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <Link to="/" style={{ color: '#2C3E50', fontWeight: 600, textDecoration: 'none', opacity: 0.9 }}>Inicio</Link>
        <Link to="/habitaciones" style={{ color: '#2C3E50', fontWeight: 600, textDecoration: 'none', opacity: 0.9 }}>Habitaciones</Link>
        {usuario ? (
          <>
            <Link to="/reservas" style={{ color: '#2C3E50', fontWeight: 600, textDecoration: 'none', opacity: 0.9 }}>Reservas</Link>
            <Link to="/facturas" style={{ color: '#2C3E50', fontWeight: 600, textDecoration: 'none', opacity: 0.9 }}>Facturas</Link>
            {(usuario.rol === 'admin' || usuario.rol === 'recepcionista' || usuario.rol === 'limpieza') && (
              <Link to="/panel" style={{ color: '#2C3E50', fontWeight: 600, textDecoration: 'none', opacity: 0.9 }}>Panel</Link>
            )}
            <span style={{ color: '#999', fontSize: '13px', borderLeft: '1px solid #ddd', paddingLeft: '20px' }}>{usuario.nombre}</span>
            <button onClick={handleLogout} className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/contacto" style={{ color: '#2C3E50', fontWeight: 600, textDecoration: 'none', opacity: 0.9 }}>Contacto</Link>
            <Link to="/register" className="btn-secondary" style={{ padding: '10px 24px', fontSize: '14px' }}>Registro</Link>
            <Link to="/login" className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>Entrar</Link>
          </>
        )}
      </div>
    </nav>
  )
}