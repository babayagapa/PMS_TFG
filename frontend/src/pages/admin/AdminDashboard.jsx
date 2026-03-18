import { useAuth } from '../../context/AuthContext.jsx';

/**
 * AdminDashboard – Main dashboard for the Administrador role.
 *
 * Accessibility (WCAG 2.1 Level A):
 *  - Landmark regions (<main>, <nav>) aid screen-reader navigation.
 *  - Page heading provides document structure.
 */
export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-hotel-night">Panel Administrador</h1>
        <button
          onClick={logout}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        >
          Cerrar sesión
        </button>
      </header>

      <p className="text-gray-700">
        Bienvenido/a, <strong>{user?.nombre} {user?.apellidos}</strong>.
      </p>

      {/* TODO: Add KPI cards, recent reservations, occupancy chart */}
    </main>
  );
}
