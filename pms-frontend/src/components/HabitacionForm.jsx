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
    if (!form.numero) e.numero = 'El número es obligatorio'
    if (!form.precio_noche || Number(form.precio_noche) <= 0)
      e.precio_noche = 'Introduce un precio válido'
    if (Number(form.capacidad) < 1)
      e.capacidad = 'Mínimo 1 persona'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validar()
    if (Object.keys(err).length) { setErrores(err); return }
    onSubmit({ ...form, precio_noche: Number(form.precio_noche), capacidad: Number(form.capacidad) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Número</label>
          <input
            type="text" placeholder="101"
            className="w-full border rounded p-2 text-sm"
            value={form.numero}
            onChange={e => set('numero', e.target.value)}
          />
          {errores.numero && <p className="text-red-500 text-xs mt-1">{errores.numero}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-1">Tipo</label>
          <select
            className="w-full border rounded p-2 text-sm"
            value={form.tipo}
            onChange={e => set('tipo', e.target.value)}
          >
            {TIPOS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Precio / noche (EUR)</label>
          <input
            type="number" min="1" placeholder="95"
            className="w-full border rounded p-2 text-sm"
            value={form.precio_noche}
            onChange={e => set('precio_noche', e.target.value)}
          />
          {errores.precio_noche && <p className="text-red-500 text-xs mt-1">{errores.precio_noche}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-1">Capacidad</label>
          <input
            type="number" min="1" max="10"
            className="w-full border rounded p-2 text-sm"
            value={form.capacidad}
            onChange={e => set('capacidad', e.target.value)}
          />
          {errores.capacidad && <p className="text-red-500 text-xs mt-1">{errores.capacidad}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark mb-1">Estado de limpieza</label>
        <select
          className="w-full border rounded p-2 text-sm"
          value={form.estado_limpieza}
          onChange={e => set('estado_limpieza', e.target.value)}
        >
          {ESTADOS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark mb-1">Descripción</label>
        <textarea
          rows="2"
          className="w-full border rounded p-2 text-sm"
          value={form.descripcion}
          onChange={e => set('descripcion', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark mb-2">Amenidades</label>
        <div className="flex flex-wrap gap-2">
          {CHIPS.map(chip => (
            <button
              key={chip} type="button"
              onClick={() => toggleChip(chip)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${form.amenidades.includes(chip)
                  ? 'bg-primary text-white border-primary'
                  : 'text-gray-600 border-gray-300 hover:border-primary'
                }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={cargando}
        className="w-full bg-primary text-white py-2 rounded text-sm font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors"
      >
        {cargando ? 'Guardando...' : (inicial._id ? 'Guardar cambios' : 'Crear habitación')}
      </button>

    </form>
  )
}