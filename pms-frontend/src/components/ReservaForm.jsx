import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createReserva } from '../services/reservas.service'
import { calcularPrecio } from '../utils/calcularPrecio'
import { formatEuros, hoy } from '../utils/formatDate'
import { useHabitaciones } from '../hooks/useHabitaciones'
import { useServicios } from '../hooks/useServicios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ReservaForm() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const { usuario } = useAuth()

  const { habitaciones } = useHabitaciones({ ocupada: false })
  const { servicios }    = useServicios()

  const [form, setForm] = useState({
    id_habitacion:    params.get('id_habitacion') || '',
    nombre_huesped:   usuario?.nombre   || '',
    email_huesped:    usuario?.email    || '',
    telefono_huesped: usuario?.telefono || '',
    fecha_entrada:    '',
    fecha_salida:     '',
    num_huespedes:    1,
    notas:            '',
  })
  const [serviciosSel, setServiciosSel] = useState([])
  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState({})

  const habitacionSel = habitaciones.find((h) => h._id === form.id_habitacion)

  // Calcular precio con servicios incluidos
  const precio = habitacionSel && form.fecha_entrada && form.fecha_salida
    ? calcularPrecio(habitacionSel.precio_noche, form.fecha_entrada, form.fecha_salida, serviciosSel)
    : null

  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))

  const toggleServicio = (servicio) => {
    setServiciosSel(prev => {
      const existe = prev.find(s => s.id_servicio === servicio._id)
      if (existe) return prev.filter(s => s.id_servicio !== servicio._id)
      return [...prev, { id_servicio: servicio._id, nombre: servicio.nombre, precio: servicio.precio, cantidad: 1 }]
    })
  }

  const setCantidad = (idServicio, cantidad) => {
    setServiciosSel(prev =>
      prev.map(s => s.id_servicio === idServicio ? { ...s, cantidad: Math.max(1, cantidad) } : s)
    )
  }

  const validar = () => {
    const e = {}
    if (!form.id_habitacion)    e.id_habitacion    = 'Selecciona una habitacion'
    if (!form.nombre_huesped)   e.nombre_huesped   = 'El nombre es obligatorio'
    if (!form.email_huesped)    e.email_huesped    = 'El email es obligatorio'
    if (!form.telefono_huesped) e.telefono_huesped = 'El telefono es obligatorio'
    if (!form.fecha_entrada)    e.fecha_entrada    = 'La fecha de entrada es obligatoria'
    if (!form.fecha_salida)     e.fecha_salida     = 'La fecha de salida es obligatoria'
    if (form.fecha_entrada && form.fecha_salida && form.fecha_salida <= form.fecha_entrada) {
      e.fecha_salida = 'La salida debe ser posterior a la entrada'
    }
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validar()
    if (Object.keys(e2).length > 0) { setErrores(e2); return }

    const payload = {
      ...form,
      servicios_pedidos: serviciosSel.map(s => ({
        id_servicio: s.id_servicio,
        cantidad:    s.cantidad,
      })),
    }

    setLoading(true)
    try {
      await createReserva(payload)
      toast.success('Reserva creada correctamente')
      nav('/reservas')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al crear la reserva')
    } finally {
      setLoading(false)
    }
  }

  // Agrupar servicios por categoria
  const categorias = [...new Set(servicios.map(s => s.categoria))].sort()

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block text-sm font-medium mb-1">Habitacion</label>
        <select
          className="w-full border rounded p-2 text-sm"
          value={form.id_habitacion}
          onChange={(e) => set('id_habitacion', e.target.value)}
        >
          <option value="">Selecciona una habitacion</option>
          {habitaciones.map((h) => (
            <option key={h._id} value={h._id}>
              {h.numero} — {h.tipo} — {formatEuros(h.precio_noche)}/noche
            </option>
          ))}
        </select>
        {errores.id_habitacion && <p className="text-red-500 text-xs mt-1">{errores.id_habitacion}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nombre del huesped</label>
        <input className="w-full border rounded p-2 text-sm" type="text"
          value={form.nombre_huesped} onChange={(e) => set('nombre_huesped', e.target.value)} />
        {errores.nombre_huesped && <p className="text-red-500 text-xs mt-1">{errores.nombre_huesped}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input className="w-full border rounded p-2 text-sm" type="email"
          value={form.email_huesped} onChange={(e) => set('email_huesped', e.target.value)} />
        {errores.email_huesped && <p className="text-red-500 text-xs mt-1">{errores.email_huesped}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Telefono</label>
        <input className="w-full border rounded p-2 text-sm" type="tel"
          value={form.telefono_huesped} onChange={(e) => set('telefono_huesped', e.target.value)} />
        {errores.telefono_huesped && <p className="text-red-500 text-xs mt-1">{errores.telefono_huesped}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Fecha entrada</label>
          <input className="w-full border rounded p-2 text-sm" type="date"
            min={hoy()} value={form.fecha_entrada}
            onChange={(e) => set('fecha_entrada', e.target.value)} />
          {errores.fecha_entrada && <p className="text-red-500 text-xs mt-1">{errores.fecha_entrada}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fecha salida</label>
          <input className="w-full border rounded p-2 text-sm" type="date"
            min={form.fecha_entrada || hoy()} value={form.fecha_salida}
            onChange={(e) => set('fecha_salida', e.target.value)} />
          {errores.fecha_salida && <p className="text-red-500 text-xs mt-1">{errores.fecha_salida}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Numero de huespedes</label>
        <input className="w-full border rounded p-2 text-sm" type="number" min="1" max="10"
          value={form.num_huespedes} onChange={(e) => set('num_huespedes', parseInt(e.target.value))} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notas (opcional)</label>
        <textarea className="w-full border rounded p-2 text-sm" rows="2"
          value={form.notas} onChange={(e) => set('notas', e.target.value)} />
      </div>

      {/* Servicios adicionales */}
      {servicios.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Servicios adicionales</label>
          {categorias.map(cat => (
            <div key={cat} style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', color: '#999', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cat}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {servicios.filter(s => s.categoria === cat).map(s => {
                  const seleccionado = serviciosSel.find(sel => sel.id_servicio === s._id)
                  return (
                    <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => toggleServicio(s)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                          seleccionado
                            ? 'bg-primary text-white border-primary'
                            : 'text-gray-600 border-gray-300 hover:border-primary'
                        }`}
                      >
                        {s.nombre} — {formatEuros(s.precio)}
                      </button>
                      {seleccionado && (
                        <input
                          type="number"
                          min="1"
                          value={seleccionado.cantidad}
                          onChange={(e) => setCantidad(s._id, parseInt(e.target.value) || 1)}
                          style={{ width: '48px', padding: '4px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '6px', textAlign: 'center' }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen del precio */}
      {precio && precio.noches > 0 && (
        <div className="bg-gray-50 border rounded p-4 text-sm">
          <p className="font-medium mb-2">Resumen del precio</p>
          <div className="flex justify-between text-gray-600">
            <span>{precio.noches} noches x {formatEuros(habitacionSel.precio_noche)}</span>
            <span>{formatEuros(precio.base)}</span>
          </div>
          {precio.servicios > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Servicios adicionales</span>
              <span>{formatEuros(precio.servicios)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>IVA (10%)</span>
            <span>{formatEuros(precio.iva)}</span>
          </div>
          <div className="flex justify-between font-bold text-primary mt-2 pt-2 border-t">
            <span>Total</span>
            <span>{formatEuros(precio.total)}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded font-medium disabled:opacity-50"
      >
        {loading ? 'Creando reserva...' : 'Crear reserva'}
      </button>

    </form>
  )
}
