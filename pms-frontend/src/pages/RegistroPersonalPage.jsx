import { useState } from 'react'
import Sidebar from '../layouts/Sidebar'
import Spinner from '../components/Spinner'
import { registerPersonalApi } from '../services/auth.service'
import toast from 'react-hot-toast'

export default function RegistroPersonalPage() {
  const [form, setForm] = useState({ nombre: '', apellidos: '', email: '', password: '', confirmar: '', nif: '', telefono: '', rol: 'recepcionista' })
  const [errores, setErrores] = useState({})
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validar = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio'
    if (!form.apellidos.trim()) e.apellidos = 'Los apellidos son obligatorios'
    if (!form.email.includes('@')) e.email = 'Introduce un email valido'
    if (form.password.length < 6) e.password = 'Minimo 6 caracteres'
    if (form.password !== form.confirmar) e.confirmar = 'Las contrasenas no coinciden'
    if (!form.nif.trim()) e.nif = 'El NIF/DNI es obligatorio'
    if (!form.telefono.trim()) e.telefono = 'El telefono es obligatorio'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setExito(null)
    const err = validar()
    if (Object.keys(err).length) { setErrores(err); return }
    setErrores({})
    setLoading(true)
    try {
      const { data } = await registerPersonalApi({
        nombre: form.nombre,
        apellidos: form.apellidos,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirmar,
        nif: form.nif,
        telefono: form.telefono,
        rol: form.rol,
      })
      toast.success('Empleado registrado correctamente')
      setExito(data.user)
      setForm({ nombre: '', apellidos: '', email: '', password: '', confirmar: '', nif: '', telefono: '', rol: 'recepcionista' })
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Error al registrar'
      toast.error(msg)
    } finally { setLoading(false) }
  }

  const iStyle = { marginBottom: '16px' }
  const errStyle = { color: '#e74c3c', fontSize: '12px', margin: '4px 0 0' }
  const rolLabels = { recepcionista: 'Recepcionista', limpieza: 'Personal de Limpieza' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '1.8rem', fontWeight: 700 }}>Registro del personal</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '32px' }}>Registra nuevos empleados en el sistema</p>

        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
          {/* Formulario */}
          <div className="glass" style={{ padding: '40px', maxWidth: '460px', width: '100%' }}>
            <form onSubmit={handleSubmit}>
              {/* Rol del empleado */}
              <div style={iStyle}>
                <label className="input-label">Rol del empleado</label>
                <select className="input-field" value={form.rol} onChange={e => set('rol', e.target.value)}>
                  <option value="recepcionista">Recepcionista</option>
                  <option value="limpieza">Personal de Limpieza</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Nombre</label>
                  <input type="text" className="input-field" placeholder="Mario" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
                  {errores.nombre && <p style={errStyle}>{errores.nombre}</p>}
                </div>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Apellidos</label>
                  <input type="text" className="input-field" placeholder="Gómez Sánchez" value={form.apellidos} onChange={e => set('apellidos', e.target.value)} />
                  {errores.apellidos && <p style={errStyle}>{errores.apellidos}</p>}
                </div>
              </div>
              <div style={iStyle}>
                <label className="input-label">Email corporativo</label>
                <input type="email" className="input-field" placeholder="empleado@hotel.com" value={form.email} onChange={e => set('email', e.target.value)} />
                {errores.email && <p style={errStyle}>{errores.email}</p>}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label className="input-label">NIF / DNI</label>
                  <input type="text" className="input-field" placeholder="12345678A" value={form.nif} onChange={e => set('nif', e.target.value)} />
                  {errores.nif && <p style={errStyle}>{errores.nif}</p>}
                </div>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Telefono</label>
                  <input type="tel" className="input-field" placeholder="+34 600 000 000" value={form.telefono} onChange={e => set('telefono', e.target.value)} />
                  {errores.telefono && <p style={errStyle}>{errores.telefono}</p>}
                </div>
              </div>
              <div style={iStyle}>
                <label className="input-label">Contrasena</label>
                <input type="password" className="input-field" placeholder="Minimo 6 caracteres" value={form.password} onChange={e => set('password', e.target.value)} />
                {errores.password && <p style={errStyle}>{errores.password}</p>}
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label className="input-label">Confirmar contrasena</label>
                <input type="password" className="input-field" placeholder="Repite la contrasena" value={form.confirmar} onChange={e => set('confirmar', e.target.value)} />
                {errores.confirmar && <p style={errStyle}>{errores.confirmar}</p>}
              </div>

              <div style={{ background: 'rgba(46,204,113,0.06)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#666' }}>
                <strong style={{ color: '#27AE60' }}>Rol asignado:</strong> {rolLabels[form.rol]}
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? <Spinner /> : `Registrar ${rolLabels[form.rol].toLowerCase()}`}
              </button>
            </form>
          </div>

          {/* Confirmacion */}
          {exito && (
            <div className="glass" style={{ padding: '32px', maxWidth: '320px', width: '100%' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✅</div>
              <h3 style={{ margin: '0 0 12px', fontWeight: 700, color: '#2C3E50' }}>Registrado correctamente</h3>
              <div style={{ fontSize: '14px', color: '#666', lineHeight: 1.6 }}>
                <p style={{ margin: '0 0 4px' }}><strong>Nombre:</strong> {exito.nombre} {exito.apellidos}</p>
                <p style={{ margin: '0 0 4px' }}><strong>Email:</strong> {exito.email}</p>
                <p style={{ margin: '0 0 4px' }}><strong>NIF:</strong> {exito.nif}</p>
                <p style={{ margin: '0 0 4px' }}><strong>Telefono:</strong> {exito.telefono}</p>
                <p style={{ margin: '0 0 4px' }}><strong>Rol:</strong> {rolLabels[exito.rol] || exito.rol}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
