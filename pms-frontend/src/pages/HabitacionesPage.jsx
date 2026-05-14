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
  const [modal,   setModal]   = useState(null)   // null | 'nueva' | objeto-habitacion
  const [saving,  setSaving]  = useState(false)

  const filtros = {}
  if (tipo)       filtros.tipo   = tipo
  if (ocupada !== '') filtros.ocupada = ocupada

  const { habitaciones, loading } = useHabitaciones(filtros)

  const guardar = async (datos) => {
    setSaving(true)
    try {
      if (modal === 'nueva') {
        await createHabitacion(datos)
        toast.success('Habitacion creada')
      } else {
        await updateHabitacion(modal._id, datos)
        toast.success('Habitacion actualizada')
      }
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
    try {
      await deleteHabitacion(id)
      toast.success('Habitacion eliminada')
      window.location.reload()
    } catch (_) {
      toast.error('No se puede eliminar')
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="p-6 max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-dark">Habitaciones</h2>
          {esAdmin && (
            <button
              onClick={() => setModal('nueva')}
              className="bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              + Nueva habitacion
            </button>
          )}
        </div>

        <div className="flex gap-3 mb-6">
          <select className="border rounded p-2 text-sm bg-white" value={tipo} onChange={e => setTipo(e.target.value)}>
            <option value="">Todos los tipos</option>
            <option value="Individual">Individual</option>
            <option value="Doble">Doble</option>
            <option value="Suite">Suite</option>
            <option value="Familiar">Familiar</option>
          </select>
          <select className="border rounded p-2 text-sm bg-white" value={ocupada} onChange={e => setOcupada(e.target.value)}>
            <option value="">Todas</option>
            <option value="false">Solo disponibles</option>
            <option value="true">Solo ocupadas</option>
          </select>
        </div>

        {loading ? (
          <Spinner />
        ) : habitaciones.length === 0 ? (
          <p className="text-gray-500">No hay habitaciones con esos filtros.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {habitaciones.map(h => (
              <div key={h._id}>
                <HabitacionCard habitacion={h} />
                {esAdmin && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setModal(h)}
                      className="flex-1 text-xs border border-primary text-primary py-1 rounded hover:bg-primary hover:text-white transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => borrar(h._id)}
                      className="flex-1 text-xs border border-red-400 text-red-400 py-1 rounded hover:bg-red-400 hover:text-white transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-screen overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-dark">
                {modal === 'nueva' ? 'Nueva habitacion' : `Editar hab. ${modal.numero}`}
              </h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 text-xl">x</button>
            </div>
            <HabitacionForm
              inicial={modal === 'nueva' ? {} : modal}
              onSubmit={guardar}
              cargando={saving}
            />
          </div>
        </div>
      )}
    </div>
  )
}