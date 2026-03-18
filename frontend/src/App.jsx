import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// ── Pages ─────────────────────────────────────────────────────────────────────
import LoginPage from './pages/auth/LoginPage.jsx';

// Admin
import AdminDashboard   from './pages/admin/AdminDashboard.jsx';
import AdminUsers       from './pages/admin/AdminUsers.jsx';
import AdminRooms       from './pages/admin/AdminRooms.jsx';

// Receptionist
import ReceptionistDashboard    from './pages/receptionist/ReceptionistDashboard.jsx';
import ReceptionistReservations from './pages/receptionist/ReceptionistReservations.jsx';

// Housekeeping
import HousekeepingDashboard from './pages/housekeeping/HousekeepingDashboard.jsx';

// Client
import ClientDashboard    from './pages/client/ClientDashboard.jsx';
import ClientReservations from './pages/client/ClientReservations.jsx';

/**
 * App – Main router.
 *
 * Route access is controlled by role via <ProtectedRoute>.
 * Roles: Administrador | Recepcionista | Limpieza | Cliente
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={<ProtectedRoute allowedRoles={['Administrador']} />}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="usuarios"    element={<AdminUsers />} />
            <Route path="habitaciones" element={<AdminRooms />} />
          </Route>

          {/* Receptionist */}
          <Route
            path="/recepcion"
            element={<ProtectedRoute allowedRoles={['Recepcionista', 'Administrador']} />}
          >
            <Route index element={<ReceptionistDashboard />} />
            <Route path="reservas" element={<ReceptionistReservations />} />
          </Route>

          {/* Housekeeping */}
          <Route
            path="/limpieza"
            element={<ProtectedRoute allowedRoles={['Limpieza', 'Administrador']} />}
          >
            <Route index element={<HousekeepingDashboard />} />
          </Route>

          {/* Client */}
          <Route
            path="/cliente"
            element={<ProtectedRoute allowedRoles={['Cliente']} />}
          >
            <Route index element={<ClientDashboard />} />
            <Route path="reservas" element={<ClientReservations />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
