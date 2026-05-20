import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { usuario, logout } = useAuth() || {}
  const nav = useNavigate()
  const esAdmin = usuario?.rol === 'admin'
  const esLimpieza = usuario?.rol === 'limpieza'

  const base = 'block px-3 py-2 rounded text-sm transition-colors'
  const activo = `${base} bg-primary text-white font-medium`
  const inactivo = `${base} text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10`

  return (
    <aside className="w-48 bg-dark text-white min-h-screen p-4 flex-shrink-0" style={{ display: 'flex', flexDirection: 'column' }}>
      <div>
        <p className="font-bold text-primary text-lg mb-1">Panel</p>
        {usuario && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: '#aaa' }}>{usuario.nombre} {usuario.apellidos || ''}</span>
            <button
              onClick={() => { logout(); nav('/'); }}
              style={{
                background: 'rgba(231,76,60,0.15)',
                border: '1px solid rgba(231,76,60,0.3)',
                color: '#e74c3c',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: 600,
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              Salir
            </button>
          </div>
        )}
        <nav className="flex flex-col gap-1">
          {!esLimpieza && (
            <NavLink to="/panel" className={({ isActive }) => isActive ? activo : inactivo}>Dashboard</NavLink>
          )}
          <NavLink to="/habitaciones" className={({ isActive }) => isActive ? activo : inactivo}>Habitaciones</NavLink>
          {!esLimpieza && (
            <>
              <NavLink to="/reservas" className={({ isActive }) => isActive ? activo : inactivo}>Reservas</NavLink>
              <NavLink to="/facturas" className={({ isActive }) => isActive ? activo : inactivo}>Facturas</NavLink>
            </>
          )}
          {esAdmin && (
            <>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '8px 0' }}></div>
              <NavLink to="/personal" className={({ isActive }) => isActive ? activo : inactivo}>Registro personal</NavLink>
            </>
          )}
        </nav>
      </div>
    </aside>
  )
}