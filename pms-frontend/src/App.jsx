import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage      from './pages/LandingPage'
import LoginPage        from './pages/LoginPage'
import HabitacionesPage from './pages/HabitacionesPage'
import ReservasPage     from './pages/ReservasPage'
import ReservaFormPage  from './pages/ReservaFormPage'
import PanelPage        from './pages/PanelPage'
import Spinner          from './components/Spinner'

function PrivateRoute({ children }) {
  const { token, cargando } = useAuth()
  if (cargando) return <Spinner />
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/"               element={<LandingPage />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/habitaciones"   element={<HabitacionesPage />} />
        <Route path="/reservas"       element={<PrivateRoute><ReservasPage /></PrivateRoute>} />
        <Route path="/reservas/nueva" element={<PrivateRoute><ReservaFormPage /></PrivateRoute>} />
        <Route path="/panel"          element={<PrivateRoute><PanelPage /></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  )
}
