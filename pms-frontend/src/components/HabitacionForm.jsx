import { useState } from 'react'

const TIPOS = ['Individual', 'Doble', 'Suite', 'Familiar']
const ESTADOS = ['Limpia', 'Sucia', 'En mantenimiento']
const CHIPS = ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Jacuzzi', 'Terraza', 'Nevera', 'Microondas']

export default function HabitacionForm({ onSubmit, inicial = {}, cargando = false }) {
  const [form, setForm] = useState({
    numero: inicial.numero || '',
    tipo: inicial.tipo || 'Individual',
    precio_noche: inicial.precio_noche || '',
    capacidad: inicial.capacidad || 1,
    estado_limpieza: inicial.estado_limpieza || 'Limpia',
    descripcion: inicial.descripcion || '',
    amenidades: inicial.amenidades || [],
  })
  const [errores, setErrores] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleChip = (chip) =>
    setForm(f => ({
      ...f,
      amenidades: f.amenidades.includes(chip)
        ? f.amenidades.filter(x => x !== chip)
        : [...f.amenidades, chip],
    }))

  const validar = () => {
    const e = {}
    if (!form.numero) e.numero = 'El numero es obligatorio'
    if (!form.precio_noche || Number(form.precio_noche) <= 0) e.precio_noche = 'Introduce un precio valido'
    if (Number(form.capacidad) < 1) e.capacidad = 'Minimo 1 persona'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validar()
    if (Object.keys(err).length) { setErrores(err); return }
    onSubmit({ ...form, precio_noche: Number(form.precio_noche), capacidad: Number(form.capacidad) })
  }

  const err = (campo) => errores[campo]
    ? <p style={{ color: '#e74c3c', fontSize: '12px', margin: '4px 0 0' }}>{errores[campo]}</p>
    : null

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label className="input-label">Numero</label>
          <input type="text" className="input-field" placeholder="101"
            value={form.numero} onChange={e => set('numero', e.target.value)} />
          {err('numero')}
        </div>
        <div>
          <label className="input-label">Tipo</label>
          <select className="input-field" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
            {TIPOS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label className="input-label">Precio / noche (EUR)</label>
          <input type="number" min="1" className="input-field" placeholder="95"
            value={form.precio_noche} onChange={e => set('precio_noche', e.target.value)} />
          {err('precio_noche')}
        </div>
        <div>
          <label className="input-label">Capacidad (personas)</label>
          <input type="number" min="1" max="10" className="input-field"
            value={form.capacidad} onChange={e => set('capacidad', e.target.value)} />
          {err('capacidad')}
        </div>
      </div>

      <div>
        <label className="input-label">Estado de limpieza</label>
        <select className="input-field" value={form.estado_limpieza} onChange={e => set('estado_limpieza', e.target.value)}>
          {ESTADOS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="input-label">Descripcion</label>
        <textarea rows="2" className="input-field"
          value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
      </div>

      <div>
        <label className="input-label">Amenidades</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
          {CHIPS.map(chip => (
            <button
              key={chip} type="button"
              onClick={() => toggleChip(chip)}
              style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                border: form.amenidades.includes(chip) ? '2px solid #2ECC71' : '2px solid #ddd',
                background: form.amenidades.includes(chip) ? '#2ECC71' : 'transparent',
                color: form.amenidades.includes(chip) ? 'white' : '#666',
                transition: 'all 0.2s',
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={cargando} style={{ width: '100%', marginTop: '4px' }}>
        {cargando ? 'Guardando...' : (inicial._id ? 'Guardar cambios' : 'Crear habitacion')}
      </button>

    </form>
  )
}