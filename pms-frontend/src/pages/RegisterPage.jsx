import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const nav = useNavigate()

  const [form, setForm] = useState({
    nombre:    '',
    email:     '',
    password:  '',
    confirmar: '',
    terminos:  false,
  })
  const [errores,  setErrores]  = useState({})
  const [enviado,  setEnviado]  = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validar = () => {
    const e = {}
    if (!form.nombre.trim())           e.nombre    = 'El nombre es obligatorio'
    if (!form.email.includes('@'))     e.email     = 'Introduce un email valido'
    if (form.password.length < 8)     e.password  = 'Minimo 8 caracteres'
    if (form.password !== form.confirmar) e.confirmar = 'Las contrasenas no coinciden'
    if (!form.terminos)                e.terminos  = 'Debes aceptar los terminos'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validar()
    if (Object.keys(err).length) { setErrores(err); return }
    // TODO: llamar a POST /api/registro cuando el backend lo implemente
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column' }}>
        <nav className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', marginBottom: '40px', position: 'sticky', top: '20px', zIndex: 100 }}>
          <Link to="/" style={{ fontWeight: 700, fontSize: '24px', color: '#2C3E50', textDecoration: 'none' }}>Hotel PMS</Link>
        </nav>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass" style={{ padding: '48px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
            <h2 style={{ margin: '0 0 8px', fontWeight: 700 }}>Registro completado</h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>Tu cuenta ha sido creada correctamente.</p>
            <button className="btn-primary" onClick={() => nav('/login')} style={{ width: '100%' }}>
              Iniciar sesion
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column' }}>

      <nav className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', marginBottom: '40px', position: 'sticky', top: '20px', zIndex: 100 }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: '24px', color: '#2C3E50', textDecoration: 'none' }}>Hotel PMS</Link>
        <Link to="/login" style={{ color: '#2C3E50', fontWeight: 600, textDecoration: 'none' }}>
          Ya tengo cuenta
        </Link>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass" style={{ padding: '48px', maxWidth: '420px', width: '100%' }}>

          <h2 style={{ margin: '0 0 6px', fontSize: '1.8rem', fontWeight: 700 }}>Crear cuenta</h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '28px' }}>
            Reserva y gestiona tus estancias
          </p>

          <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: '16px' }}>
              <label className="input-label">Nombre completo</label>
              <input
                type="text"
                className="input-field"
                placeholder="Mario Garcia"
                value={form.nombre}
                onChange={e => set('nombre', e.target.value)}
              />
              {errores.nombre && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '4px 0 0' }}>{errores.nombre}</p>}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="input-label">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="mario@email.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
              />
              {errores.email && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '4px 0 0' }}>{errores.email}</p>}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="input-label">Contrasena</label>
              <input
                type="password"
                className="input-field"
                placeholder="Minimo 8 caracteres"
                value={form.password}
                onChange={e => set('password', e.target.value)}
              />
              {errores.password && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '4px 0 0' }}>{errores.password}</p>}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="input-label">Confirmar contrasena</label>
              <input
                type="password"
                className="input-field"
                placeholder="Repite la contrasena"
                value={form.confirmar}
                onChange={e => set('confirmar', e.target.value)}
              />
              {errores.confirmar && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '4px 0 0' }}>{errores.confirmar}</p>}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px' }}>
              <input
                type="checkbox"
                id="terminos"
                checked={form.terminos}
                onChange={e => set('terminos', e.target.checked)}
                style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: '#2ECC71', cursor: 'pointer' }}
              />
              <label htmlFor="terminos" style={{ fontSize: '13px', color: '#555', cursor: 'pointer', lineHeight: 1.4 }}>
                Acepto los{' '}
                <a href="#" style={{ color: '#2ECC71', textDecoration: 'underline' }}>terminos y condiciones</a>
                {' '}y la{' '}
                <a href="#" style={{ color: '#2ECC71', textDecoration: 'underline' }}>politica de privacidad</a>
              </label>
            </div>
            {errores.terminos && <p style={{ color: '#e74c3c', fontSize: '12px', margin: '-16px 0 16px' }}>{errores.terminos}</p>}

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Crear cuenta
            </button>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#666', marginTop: '16px' }}>
              Ya tienes cuenta?{' '}
              <Link to="/login" style={{ color: '#2ECC71', fontWeight: 600, textDecoration: 'none' }}>
                Inicia sesion
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  )
}