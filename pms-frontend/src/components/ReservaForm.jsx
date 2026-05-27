import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createReserva } from '../services/reservas.service'
import { calcularPrecio } from '../utils/calcularPrecio'
import { formatEuros, hoy } from '../utils/formatDate'
import { useHabitaciones } from '../hooks/useHabitaciones'
import { useReservas } from '../hooks/useReservas'
import { useServicios } from '../hooks/useServicios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ReservaForm() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const { usuario } = useAuth()

  const { habitaciones } = useHabitaciones()
  const { reservas } = useReservas()
  const { servicios } = useServicios()

  const [form, setForm] = useState({
    id_habitacion: params.get('id_habitacion') || '',
    nombre_huesped: usuario ? `${usuario.nombre} ${usuario.apellidos || ''}`.trim() : '',
    email_huesped: usuario?.email || '',
    telefono_huesped: usuario?.telefono || '',
    fecha_entrada: params.get('fecha_entrada') || '',
    fecha_salida: params.get('fecha_salida') || '',
    num_huespedes: 1,
    notas: '',
  })
  const [serviciosSel, setServiciosSel] = useState([])
  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState({})

  const habitacionesDisponibles = useMemo(() => {
    if (!form.fecha_entrada || !form.fecha_salida) return habitaciones
    const activas = reservas.filter(r => r.estado !== 'Cancelada')
    return habitaciones.filter(h => {
      const conflicto = activas.some(r =>
        r.id_habitacion === h._id &&
        r.fecha_entrada < form.fecha_salida &&
        r.fecha_salida > form.fecha_entrada
      )
      return !conflicto
    })
  }, [habitaciones, reservas, form.fecha_entrada, form.fecha_salida])

  const habSel = habitacionesDisponibles.find(h => h._id === form.id_habitacion)
  const precio = habSel && form.fecha_entrada && form.fecha_salida
    ? calcularPrecio(habSel.precio_noche, form.fecha_entrada, form.fecha_salida, serviciosSel)
    : null

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

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
    if (!form.id_habitacion) e.id_habitacion = 'Selecciona una habitacion'
    if (!form.nombre_huesped) e.nombre_huesped = 'El nombre es obligatorio'
    if (!form.email_huesped) e.email_huesped = 'El email es obligatorio'
    if (!form.telefono_huesped) e.telefono_huesped = 'El telefono es obligatorio'
    if (!form.fecha_entrada) e.fecha_entrada = 'La fecha de entrada es obligatoria'
    if (!form.fecha_salida) e.fecha_salida = 'La fecha de salida es obligatoria'
    if (form.fecha_entrada && form.fecha_salida && form.fecha_salida <= form.fecha_entrada)
      e.fecha_salida = 'La salida debe ser posterior a la entrada'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validar()
    if (Object.keys(e2).length) { setErrores(e2); return }
    setLoading(true)
    try {
      await createReserva({
        ...form,
        servicios_pedidos: serviciosSel.map(s => ({ id_servicio: s.id_servicio, cantidad: s.cantidad })),
      })
      toast.success('Reserva creada correctamente')
      nav('/reservas')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al crear la reserva')
    } finally {
      setLoading(false)
    }
  }

  const err = (campo) => errores[campo]
    ? <p style={{ color: '#e74c3c', fontSize: '12px', margin: '4px 0 0' }}>{errores[campo]}</p>
    : null

  const categorias = [...new Set(servicios.map(s => s.categoria))].sort()

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div>
        <label className="input-label">Habitacion</label>
        <select className="input-field" value={form.id_habitacion} onChange={e => set('id_habitacion', e.target.value)}>
          <option value="">Selecciona una habitacion</option>
          {habitacionesDisponibles.map(h => (
            <option key={h._id} value={h._id}>
              {h.numero} — {h.tipo} — {formatEuros(h.precio_noche)}/noche
            </option>
          ))}
        </select>
        {err('id_habitacion')}
      </div>

      <div>
        <label className="input-label">Nombre del huesped</label>
        <input type="text" className="input-field"
          value={form.nombre_huesped} onChange={e => set('nombre_huesped', e.target.value)} />
        {err('nombre_huesped')}
      </div>

      <div>
        <label className="input-label">Email</label>
        <input type="email" className="input-field"
          value={form.email_huesped} onChange={e => set('email_huesped', e.target.value)} />
        {err('email_huesped')}
      </div>

      <div>
        <label className="input-label">Telefono</label>
        <input type="tel" className="input-field"
          value={form.telefono_huesped} onChange={e => set('telefono_huesped', e.target.value)} />
        {err('telefono_huesped')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label className="input-label">Fecha entrada</label>
          <input type="date" className="input-field" min={hoy()}
            value={form.fecha_entrada} onChange={e => set('fecha_entrada', e.target.value)} />
          {err('fecha_entrada')}
        </div>
        <div>
          <label className="input-label">Fecha salida</label>
          <input type="date" className="input-field" min={form.fecha_entrada || hoy()}
            value={form.fecha_salida} onChange={e => set('fecha_salida', e.target.value)} />
          {err('fecha_salida')}
        </div>
      </div>

      <div>
        <label className="input-label">Numero de huespedes</label>
        <input type="number" min="1" max="10" className="input-field"
          value={form.num_huespedes} onChange={e => set('num_huespedes', parseInt(e.target.value))} />
      </div>

      <div>
        <label className="input-label">Notas (opcional)</label>
        <textarea rows="2" className="input-field"
          value={form.notas} onChange={e => set('notas', e.target.value)} />
      </div>

      {servicios.length > 0 && (
        <div>
          <label className="input-label">Servicios adicionales</label>
          {categorias.map(cat => (
            <div key={cat} style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '11px', color: '#999', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cat}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {servicios.filter(s => s.categoria === cat).map(s => {
                  const sel = serviciosSel.find(x => x.id_servicio === s._id)
                  return (
                    <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => toggleServicio(s)}
                        style={{
                          padding: '6px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                          border: sel ? '2px solid #2ECC71' : '2px solid #ddd',
                          background: sel ? '#2ECC71' : 'transparent',
                          color: sel ? 'white' : '#666',
                          transition: 'all 0.2s',
                        }}
                      >
                        {s.nombre} — {formatEuros(s.precio)}
                      </button>
                      {sel && (
                        <input type="number" min="1" value={sel.cantidad}
                          onChange={e => setCantidad(s._id, parseInt(e.target.value) || 1)}
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

      {precio && precio.noches > 0 && (
        <div className="glass" style={{ padding: '16px', fontSize: '14px' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Resumen del precio</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
            <span>{precio.noches} noches x {formatEuros(habSel.precio_noche)}</span>
            <span>{formatEuros(precio.base)}</span>
          </div>
          {precio.servicios > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
              <span>Servicios adicionales</span>
              <span>{formatEuros(precio.servicios)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
            <span>IVA (10%)</span>
            <span>{formatEuros(precio.iva)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#2ECC71', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <span>Total</span>
            <span>{formatEuros(precio.total)}</span>
          </div>
        </div>
      )}

      <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Creando reserva...' : 'Crear reserva'}
      </button>

    </form>
  )
}