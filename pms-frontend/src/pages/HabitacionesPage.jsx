import { useState } from 'react'
import Navbar from '../layouts/Navbar'
import Spinner from '../components/Spinner'
import HabitacionCard from '../components/HabitacionCard'
import HabitacionForm from '../components/HabitacionForm'
import { useHabitaciones } from '../hooks/useHabitaciones'
import { useAuth } from '../context/AuthContext'
import { createHabitacion, updateHabitacion, deleteHabitacion } from '../services/habitaciones.service'
import toast from 'react-hot-toast'

export default function HabitacionesPage() {
  const { usuario } = useAuth() || {}
  const esAdmin = usuario?.rol === 'admin'

  const [tipo,    setTipo]    = useState('')
  const [ocupada, setOcupada] = useState('')
  const [modal,   setModal]   = useState(null)
  const [saving,  setSaving]  = useState(false)

  const filtros = {}
  if (tipo)           filtros.tipo   = tipo
  if (ocupada !== '') filtros.ocupada = ocupada

  const { habitaciones, loading } = useHabitaciones(filtros)

  const guardar = async (datos) => {
    setSaving(true)
    try {
      if (modal === 'nueva') { await createHabitacion(datos); toast.success('Habitacion creada') }
      else                   { await updateHabitacion(modal._id, datos); toast.success('Habitacion actualizada') }
      setModal(null)
      window.location.reload()
    } catch (_) {
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const borrar = async (id) => {
    if (!window.confirm('Eliminar esta habitacion?')) return
    try { await deleteHabitacion(id); toast.success('Eliminada'); window.location.reload() }
    catch (_) { toast.error('No se puede eliminar') }
  }

  return (
    <div className="page">
      <Navbar />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>Habitaciones</h2>
        {esAdmin && (
          <button className="btn-primary" onClick={() => setModal('nueva')} style={{ padding: '12px 24px', fontSize: '14px' }}>
            + Nueva habitacion
          </button>
        )}
      </div>

      {/* Filtros glass */}
      <div className="glass" style={{ display: 'flex', gap: '16px', padding: '20px 24px', marginBottom: '32px' }}>
        <select className="input-field" style={{ maxWidth: '200px' }} value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          <option value="Individual">Individual</option>
          <option value="Doble">Doble</option>
          <option value="Suite">Suite</option>
          <option value="Familiar">Familiar</option>
        </select>
        <select className="input-field" style={{ maxWidth: '200px' }} value={ocupada} onChange={e => setOcupada(e.target.value)}>
          <option value="">Todas</option>
          <option value="false">Solo disponibles</option>
          <option value="true">Solo ocupadas</option>
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : habitaciones.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center', padding: '60px 0' }}>No hay habitaciones con esos filtros.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {habitaciones.map(h => (
            <div key={h._id}>
              <HabitacionCard habitacion={h} />
              {esAdmin && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button onClick={() => setModal(h)} className="btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '13px' }}>Editar</button>
                  <button onClick={() => borrar(h._id)} style={{ flex: 1, padding: '8px', fontSize: '13px', background: 'transparent', border: '2px solid #e74c3c', color: '#e74c3c', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>Eliminar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontWeight: 700 }}>{modal === 'nueva' ? 'Nueva habitacion' : `Editar hab. ${modal.numero}`}</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}>&times;</button>
            </div>
            <HabitacionForm inicial={modal === 'nueva' ? {} : modal} onSubmit={guardar} cargando={saving} />
          </div>
        </div>
      )}
    </div>
  )
}