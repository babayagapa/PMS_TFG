import { useAuth } from '../../context/AuthContext.jsx';

/**
 * ClientDashboard – Self-service portal for the Cliente role.
 *
 * Accessibility (WCAG 2.1 Level A):
 *  - Navigation links have descriptive text.
 *  - Interactive elements are keyboard accessible.
 */
export default function ClientDashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-hotel-night">Mi Portal</h1>
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

      {/* TODO: Show upcoming reservations and allow new booking */}
    </main>
  );
}
