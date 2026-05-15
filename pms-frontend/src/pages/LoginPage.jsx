import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { login } = useAuth()
  const nav       = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Completa todos los campos'); return }
    setLoading(true)
    try {
      await login(email, password)
      nav('/panel')
    } catch (_) {
      setError('Email o contrasena incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">

      {/* Navbar simple */}
      <nav className="bg-white shadow-sm px-8 py-4">
        <Link to="/" className="font-bold text-xl text-dark">Hotel PMS</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="glass rounded-2xl shadow-xl w-full max-w-sm p-8">
          <h2 className="text-2xl font-bold text-dark mb-2">Bienvenido</h2>
          <p className="text-gray-500 text-sm mb-6">Accede al panel de gestion</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                placeholder="admin@hotel.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-1">Contrasena</label>
              <input
                type="password"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 shadow-md mt-2"
            >
              {loading ? <Spinner /> : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
