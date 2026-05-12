import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import HabitacionesPage from './pages/HabitacionesPage'
import ReservasPage from './pages/ReservasPage'
import ReservaFormPage from './pages/ReservaFormPage'
import PanelPage from './pages/PanelPage'

// TODO: aÃ±adir PrivateRoute para proteger /panel y /reservas
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/"              element={<LandingPage />} />
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/habitaciones"  element={<HabitacionesPage />} />
        <Route path="/reservas"      element={<ReservasPage />} />
        <Route path="/reservas/nueva" element={<ReservaFormPage />} />
        <Route path="/panel"         element={<PanelPage />} />
      </Routes>
    </AuthProvider>
  )
}