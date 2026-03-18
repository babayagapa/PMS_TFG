import { useAuth } from '../../context/AuthContext.jsx';

/**
 * ReceptionistDashboard – Main dashboard for the Recepcionista role.
 *
 * Accessibility (WCAG 2.1 Level A):
 *  - Landmark regions aid navigation.
 *  - Heading hierarchy is maintained.
 */
export default function ReceptionistDashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-hotel-night">Panel Recepción</h1>
        <button
          onClick={logout}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        >
          Cerrar sesión
        </button>
      </header>

      <p className="text-gray-700">
        Bienvenido/a, <strong>{user?.nombre}</strong>.
      </p>

      {/* TODO: Check-in/check-out quick actions, today's arrivals list */}
    </main>
  );
}
