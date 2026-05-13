import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Formulario de login con email y contraseña
export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const { login }               = useAuth() || {}
  const nav                     = useNavigate()

  // TODO: handleSubmit → llamar a login(), redirigir a /panel si ok
  // TODO: mostrar spinner mientras carga
  // TODO: validar que email y password no estén vacíos antes de enviar

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-primary">Iniciar sesión</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input className="w-full border p-2 rounded mb-3" type="email"
          placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded mb-4" type="password"
          placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-primary text-white py-2 rounded">
          Entrar
        </button>
      </div>
    </div>
  )
}