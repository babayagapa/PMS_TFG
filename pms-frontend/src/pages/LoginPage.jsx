import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
      const user = await login(email, password)
      // Clientes van a inicio, limpieza a habitaciones, admin/recepcionista a panel
      if (user.rol === 'cliente') nav('/')
      else if (user.rol === 'limpieza') nav('/habitaciones')
      else nav('/panel')
    } catch (_) {
      setError('Email o contrasena incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column' }}>

      <nav className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', marginBottom: '40px', position: 'sticky', top: '20px', zIndex: 100 }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: '24px', color: '#2C3E50', textDecoration: 'none' }}>Hotel PMS</Link>
        <Link to="/registro" style={{ color: '#2C3E50', fontWeight: 600, textDecoration: 'none' }}>
          Crear cuenta
        </Link>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass" style={{ padding: '48px', maxWidth: '420px', width: '100%' }}>

          <h2 style={{ margin: '0 0 6px', fontSize: '1.8rem', fontWeight: 700 }}>Bienvenido</h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '28px' }}>Accede al panel de gestion</p>

          {error && (
            <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', color: '#e74c3c', fontSize: '14px', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label className="input-label">Email</label>
              <input type="email" className="input-field" placeholder="admin@hotel.com"
                style={{ borderColor: error ? '#e74c3c' : '' }}
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label className="input-label">Contrasena</label>
              <input type="password" className="input-field" placeholder="••••••••"
                style={{ borderColor: error ? '#e74c3c' : '' }}
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? <Spinner /> : 'Entrar'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginTop: '16px' }}>
              No tienes cuenta?{' '}
              <Link to="/registro" style={{ color: '#2ECC71', fontWeight: 600, textDecoration: 'none' }}>
                Registrate
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
