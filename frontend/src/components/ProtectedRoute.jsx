import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * ProtectedRoute
 *
 * Wraps routes that require authentication and specific roles.
 *
 * Accessibility note (WCAG 2.1 Level A):
 *  - The loading indicator uses role="status" and aria-live="polite" so screen
 *    readers announce when authentication is being verified.
 *
 * @param {string[]} allowedRoles - Roles that may access the wrapped routes.
 */
export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      // WCAG 2.1 – 4.1.3 Status Messages: use role="status" for live regions
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-screen items-center justify-center"
      >
        <span className="sr-only">Verificando autenticación…</span>
        <div
          aria-hidden="true"
          className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"
        />
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but wrong role → redirect to their own dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    const ROLE_ROUTES = {
      Administrador: '/admin',
      Recepcionista: '/recepcion',
      Limpieza:      '/limpieza',
      Cliente:       '/cliente',
    };
    const fallback = ROLE_ROUTES[user.rol] ?? '/login';
    return <Navigate to={fallback} replace />;
  }

  // Authorised – render child routes
  return <Outlet />;
}
