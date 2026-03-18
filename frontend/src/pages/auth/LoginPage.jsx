import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * LoginPage – Public login form.
 *
 * Accessibility (WCAG 2.1 Level A):
 *  - All form inputs have explicit <label> associations via htmlFor/id.
 *  - Error messages are announced via role="alert".
 *  - Submit button state is communicated with aria-busy.
 */
export default function LoginPage() {
  const { login, isLoading } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch {
      setError('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Heading */}
        <h1 className="mb-6 text-center text-2xl font-bold text-hotel-night">
          PMS Hotel – Acceso
        </h1>

        {/* Error message (WCAG 2.1 – 3.3.1 Error Identification) */}
        {error && (
          <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              aria-required="true"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              aria-required="true"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="w-full rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-60"
          >
            {isLoading ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </main>
  );
}
