import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage              from './pages/LandingPage'
import LoginPage                from './pages/LoginPage'
import RegisterPage             from './pages/RegisterPage'
import HabitacionesClientePage  from './pages/HabitacionesClientePage'
import HabitacionesStaffPage    from './pages/HabitacionesStaffPage'
import ReservasPage             from './pages/ReservasPage'
import ReservasStaffPage        from './pages/ReservasStaffPage'
import ReservaFormPage          from './pages/ReservaFormPage'
import PanelPage                from './pages/PanelPage'
import FacturasPage             from './pages/FacturasPage'
import FacturaDetallePage       from './pages/FacturaDetallePage'
import RegistroPersonalPage     from './pages/RegistroPersonalPage'
import Spinner                  from './components/Spinner'

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

function StaffRoute({ children }) {
  const { usuario, token, cargando } = useAuth()
  if (cargando) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><Spinner /></div>
  if (!token) return <Navigate to="/login" replace />
  if (usuario?.rol === 'cliente') return <Navigate to="/" replace />
  return children
}

// Muestra la vista de habitaciones segun el rol
function HabitacionesRouter() {
  const { usuario } = useAuth()
  const esStaff = usuario && usuario.rol !== 'cliente'
  return esStaff ? <HabitacionesStaffPage /> : <HabitacionesClientePage />
}

// Muestra reservas segun el rol
function ReservasRouter() {
  const { usuario } = useAuth()
  const esStaff = usuario && usuario.rol !== 'cliente'
  return esStaff ? <ReservasStaffPage /> : <ReservasPage />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/"               element={<LandingPage />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/registro"       element={<RegisterPage />} />
        <Route path="/habitaciones"   element={<HabitacionesRouter />} />
        <Route path="/reservas"       element={<PrivateRoute><ReservasRouter /></PrivateRoute>} />
        <Route path="/reservas/nueva" element={<PrivateRoute><ReservaFormPage /></PrivateRoute>} />
        <Route path="/facturas"       element={<PrivateRoute><FacturasPage /></PrivateRoute>} />
        <Route path="/facturas/:id"   element={<PrivateRoute><FacturaDetallePage /></PrivateRoute>} />
        <Route path="/panel"          element={<StaffRoute><PanelPage /></StaffRoute>} />
        <Route path="/personal"       element={<AdminRoute><RegistroPersonalPage /></AdminRoute>} />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
