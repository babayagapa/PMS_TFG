import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'

export default function RegisterPage() {
  const nav = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ nombre:'', email:'', password:'', confirmar:'', nif:'', telefono:'', terminos:false })
  const [errores, setErrores] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const validar = () => {
    const e = {}
    if(!form.nombre.trim()) e.nombre='El nombre es obligatorio'
    if(!form.email.includes('@')) e.email='Introduce un email valido'
    if(form.password.length<6) e.password='Minimo 6 caracteres'
    if(form.password!==form.confirmar) e.confirmar='Las contrasenas no coinciden'
    if(!form.nif.trim()) e.nif='El NIF es obligatorio'
    if(!form.telefono.trim()) e.telefono='El telefono es obligatorio'
    if(!form.terminos) e.terminos='Debes aceptar los terminos'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    const err = validar()
    if(Object.keys(err).length){setErrores(err);return}
    setLoading(true)
    try {
      await register({nombre:form.nombre,email:form.email,password:form.password,password_confirmation:form.confirmar,nif:form.nif,telefono:form.telefono})
      nav('/habitaciones')
    } catch(err) {
      setError(err.response?.data?.message||err.response?.data?.error||'Error al registrar')
    } finally { setLoading(false) }
  }

  const inputStyle = { marginBottom:'16px' }

  return (
    <div className="page" style={{display:'flex',flexDirection:'column'}}>
      <nav className="glass" style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 40px',marginBottom:'40px',position:'sticky',top:'20px',zIndex:100}}>
        <Link to="/" style={{fontWeight:700,fontSize:'24px',color:'#2C3E50',textDecoration:'none'}}>Hotel PMS</Link>
        <Link to="/login" style={{color:'#2C3E50',fontWeight:600,textDecoration:'none'}}>Ya tengo cuenta</Link>
      </nav>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div className="glass" style={{padding:'48px',maxWidth:'420px',width:'100%'}}>
          <h2 style={{margin:'0 0 6px',fontSize:'1.8rem',fontWeight:700}}>Crear cuenta</h2>
          <p style={{color:'#666',fontSize:'14px',marginBottom:'28px'}}>Reserva y gestiona tus estancias</p>
          {error&&<div style={{background:'rgba(231,76,60,0.1)',border:'1px solid rgba(231,76,60,0.3)',color:'#e74c3c',fontSize:'14px',padding:'12px 16px',borderRadius:'10px',marginBottom:'16px'}}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={inputStyle}><label className="input-label">Nombre completo</label><input type="text" className="input-field" placeholder="Mario Garcia" value={form.nombre} onChange={e=>set('nombre',e.target.value)}/>{errores.nombre&&<p style={{color:'#e74c3c',fontSize:'12px',margin:'4px 0 0'}}>{errores.nombre}</p>}</div>
            <div style={inputStyle}><label className="input-label">Email</label><input type="email" className="input-field" placeholder="mario@email.com" value={form.email} onChange={e=>set('email',e.target.value)}/>{errores.email&&<p style={{color:'#e74c3c',fontSize:'12px',margin:'4px 0 0'}}>{errores.email}</p>}</div>
            <div style={{display:'flex',gap:'12px',marginBottom:'16px'}}>
              <div style={{flex:1}}><label className="input-label">NIF / DNI</label><input type="text" className="input-field" placeholder="12345678A" value={form.nif} onChange={e=>set('nif',e.target.value)}/>{errores.nif&&<p style={{color:'#e74c3c',fontSize:'12px',margin:'4px 0 0'}}>{errores.nif}</p>}</div>
              <div style={{flex:1}}><label className="input-label">Telefono</label><input type="tel" className="input-field" placeholder="+34 600 000 000" value={form.telefono} onChange={e=>set('telefono',e.target.value)}/>{errores.telefono&&<p style={{color:'#e74c3c',fontSize:'12px',margin:'4px 0 0'}}>{errores.telefono}</p>}</div>
            </div>
            <div style={inputStyle}><label className="input-label">Contrasena</label><input type="password" className="input-field" placeholder="Minimo 6 caracteres" value={form.password} onChange={e=>set('password',e.target.value)}/>{errores.password&&<p style={{color:'#e74c3c',fontSize:'12px',margin:'4px 0 0'}}>{errores.password}</p>}</div>
            <div style={{marginBottom:'20px'}}><label className="input-label">Confirmar contrasena</label><input type="password" className="input-field" placeholder="Repite la contrasena" value={form.confirmar} onChange={e=>set('confirmar',e.target.value)}/>{errores.confirmar&&<p style={{color:'#e74c3c',fontSize:'12px',margin:'4px 0 0'}}>{errores.confirmar}</p>}</div>
            <div style={{display:'flex',alignItems:'flex-start',gap:'10px',marginBottom:'24px'}}>
              <input type="checkbox" id="terminos" checked={form.terminos} onChange={e=>set('terminos',e.target.checked)} style={{width:'16px',height:'16px',marginTop:'2px',accentColor:'#2ECC71',cursor:'pointer'}}/>
              <label htmlFor="terminos" style={{fontSize:'13px',color:'#555',cursor:'pointer',lineHeight:1.4}}>Acepto los <a href="#" style={{color:'#2ECC71',textDecoration:'underline'}}>terminos y condiciones</a> y la <a href="#" style={{color:'#2ECC71',textDecoration:'underline'}}>politica de privacidad</a></label>
            </div>
            {errores.terminos&&<p style={{color:'#e74c3c',fontSize:'12px',margin:'-16px 0 16px'}}>{errores.terminos}</p>}
            <button type="submit" className="btn-primary" disabled={loading} style={{width:'100%'}}>{loading?<Spinner/>:'Crear cuenta'}</button>
            <p style={{textAlign:'center',fontSize:'13px',color:'#666',marginTop:'16px'}}>Ya tienes cuenta? <Link to="/login" style={{color:'#2ECC71',fontWeight:600,textDecoration:'none'}}>Inicia sesion</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}