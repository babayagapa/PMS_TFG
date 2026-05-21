import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HabitacionesClientePage from './pages/HabitacionesClientePage'
import HabitacionesEmpleadoPage from './pages/HabitacionesEmpleadoPage'
import ReservasPage from './pages/ReservasPage'
import ReservasEmpleadoPage from './pages/ReservasEmpleadoPage'
import ReservaFormPage from './pages/ReservaFormPage'
import PanelPage from './pages/PanelPage'
import FacturasClientePage from './pages/FacturasClientePage'
import FacturasEmpleadoPage from './pages/FacturasEmpleadoPage'
import FacturaDetalleClientePage from './pages/FacturaDetalleClientePage'
import FacturaDetalleEmpleadoPage from './pages/FacturaDetalleEmpleadoPage'
import RegisterPersonalPage from './pages/RegisterPersonalPage'
import Spinner from './components/Spinner'

function PrivateRoute({ children }) {
  const { token, cargando } = useAuth()
  if (cargando) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Spinner /></div>
  return token ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { usuario, token, cargando } = useAuth()
  if (cargando) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Spinner /></div>
  if (!token) return <Navigate to="/login" replace />
  if (usuario?.rol !== 'admin') return <Navigate to="/" replace />
  return children
}

function EmpleadoRoute({ children }) {
  const { usuario, token, cargando } = useAuth()
  if (cargando) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Spinner /></div>
  if (!token) return <Navigate to="/login" replace />
  if (usuario?.rol === 'cliente' || usuario?.rol === 'limpieza') {
    return <Navigate to={usuario?.rol === 'limpieza' ? '/habitaciones' : '/'} replace />
  }
  return children
}

function HabitacionesRouter() {
  const { usuario } = useAuth()
  return usuario && usuario.rol !== 'cliente'
    ? <HabitacionesEmpleadoPage />
    : <HabitacionesClientePage />
}

function ReservasRouter() {
  const { usuario } = useAuth()
  if (usuario?.rol === 'limpieza') return <Navigate to="/habitaciones" replace />
  return usuario && usuario.rol !== 'cliente'
    ? <ReservasEmpleadoPage />
    : <ReservasPage />
}

function FacturasRouter() {
  const { usuario } = useAuth()
  if (usuario?.rol === 'limpieza') return <Navigate to="/habitaciones" replace />
  return usuario && usuario.rol !== 'cliente'
    ? <FacturasEmpleadoPage />
    : <FacturasClientePage />
}

function FacturaDetalleRouter() {
  const { usuario } = useAuth()
  if (usuario?.rol === 'limpieza') return <Navigate to="/habitaciones" replace />
  return usuario && usuario.rol !== 'cliente'
    ? <FacturaDetalleEmpleadoPage />
    : <FacturaDetalleClientePage />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/habitaciones" element={<HabitacionesRouter />} />
        <Route path="/reservas" element={<PrivateRoute><ReservasRouter /></PrivateRoute>} />
        <Route path="/reservas/nueva" element={<PrivateRoute><ReservaFormPage /></PrivateRoute>} />
        <Route path="/facturas" element={<PrivateRoute><FacturasRouter /></PrivateRoute>} />
        <Route path="/facturas/:id" element={<PrivateRoute><FacturaDetalleRouter /></PrivateRoute>} />
        <Route path="/panel" element={<EmpleadoRoute><PanelPage /></EmpleadoRoute>} />
        <Route path="/personal" element={<AdminRoute><RegisterPersonalPage /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}