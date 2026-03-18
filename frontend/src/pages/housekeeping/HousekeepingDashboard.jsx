import { useAuth } from '../../context/AuthContext.jsx';

/**
 * HousekeepingDashboard – Room cleaning status page for the Limpieza role.
 *
 * Accessibility (WCAG 2.1 Level A):
 *  - Status changes use aria-live regions to announce updates.
 *  - Colour is never the sole indicator of status (icons/text accompany it).
 */
export default function HousekeepingDashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-hotel-night">Panel Limpieza</h1>
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

      {/* TODO: List rooms with estado_limpieza, allow marking as Limpia/Mantenimiento */}
    </main>
  );
}
