import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login }               = useAuth()
  const nav                     = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-primary">Iniciar sesion</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <input
          className="w-full border p-2 rounded mb-3 text-sm"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded mb-4 text-sm"
          type="password"
          placeholder="Contrasena"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded text-sm font-medium disabled:opacity-50"
        >
          {loading ? <Spinner /> : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
