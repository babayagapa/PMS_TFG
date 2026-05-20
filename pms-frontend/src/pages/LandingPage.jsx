import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../layouts/Navbar'
import Spinner from '../components/Spinner'
import { useHabitaciones } from '../hooks/useHabitaciones'
import { formatEuros, hoy } from '../utils/formatDate'

const IMG_MAP = {
  Individual: '/img/individual.png',
  Doble: '/img/doble.png',
  Suite: '/img/suite.png',
  Familiar: '/img/familiar.png',
}

const DESCRIPCIONES = {
  Individual: 'Habitación acogedora con cama individual, ideal para viajeros de negocios.',
  Doble: 'Espaciosa habitación con cama de matrimonio, perfecta para parejas.',
  Suite: 'Experiencia de lujo con salón privado y terraza panorámica.',
  Familiar: 'Ideal para familias, con amplio espacio y zona infantil.',
}

const TAGS = {
  Individual: ['WiFi', 'Escritorio', '1 Persona'],
  Doble: ['WiFi', 'Cama Queen', '2 Personas'],
  Suite: ['WiFi', 'Jacuzzi', 'Terraza', '2 Personas'],
  Familiar: ['WiFi', 'Smart TV', 'Nevera', '4 Personas'],
}

export default function LandingPage() {
  const nav = useNavigate()
  const { habitaciones, loading } = useHabitaciones()

  const [entrada, setEntrada] = useState('')
  const [salida, setSalida] = useState('')
  const [huespedes, setHuespedes] = useState('1')

  const handleBuscar = () => {
    const params = new URLSearchParams()
    if (entrada) params.set('entrada', entrada)
    if (salida) params.set('salida', salida)
    if (huespedes) params.set('huespedes', huespedes)
    nav(`/habitaciones?${params.toString()}`)
  }

  const tipos = useMemo(() => {
    const disponibles = habitaciones.filter(h => !h.ocupada && h.estado_limpieza === 'Limpia')
    const agrupado = {}
    disponibles.forEach(h => {
      if (!agrupado[h.tipo]) agrupado[h.tipo] = { tipo: h.tipo, min_precio: h.precio_noche }
      if (h.precio_noche < agrupado[h.tipo].min_precio) agrupado[h.tipo].min_precio = h.precio_noche
    })
    return Object.values(agrupado)
  }, [habitaciones])

  const orden = ['Suite', 'Familiar', 'Doble', 'Individual']
  const tiposOrdenados = [...tipos].sort((a, b) => orden.indexOf(a.tipo) - orden.indexOf(b.tipo))

  return (
    <div className="Page">
      <Navbar />

      <header className="glass" style={{ display: 'flex', gap: '50px', padding: '60px 40px', marginBottom: '40px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '3.5rem', marginTop: 0, marginBottom: '20px', lineHeight: 1.1, letterSpacing: '-1px' }}>
            Gestión inteligente,<br />estancias perfectas.
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '40px', lineHeight: 1.5, maxWidth: '420px' }}>
            El Property Management System diseñado para simplificar tus reservas,
            automatizar tareas y mejorar la experiencia de tus huéspedes desde el primer clic.
          </p>
          <button className="btn-primary" onClick={() => nav('/habitaciones')}>
            Reservar Habitación
          </button>
        </div>
        <div style={{ flex: 1, height: '350px', borderRadius: '16px', overflow: 'hidden' }}>
          <img src="/img/suite.png" alt="Hotel Suite" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </header>

      <section className="glass" style={{ display: 'flex', gap: '20px', padding: '30px 40px', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div className="input-group">
          <label className="input-label">Fecha de Entrada</label>
          <input type="date" className="input-field" min={hoy()} value={entrada} onChange={e => setEntrada(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Fecha de Salida</label>
          <input type="date" className="input-field" min={entrada || hoy()} value={salida} onChange={e => setSalida(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Número de Huéspedes</label>
          <select className="input-field" value={huespedes} onChange={e => setHuespedes(e.target.value)}>
            <option value="1">1 Huésped</option>
            <option value="2">2 Huéspedes</option>
            <option value="3">3 Huéspedes</option>
            <option value="4">4 Huéspedes</option>
            <option value="5">5+ Huéspedes</option>
          </select>
        </div>
        <button className="btn-primary" onClick={handleBuscar} style={{ height: '47px', padding: '0 40px', whiteSpace: 'nowrap' }}>
          Buscar
        </button>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
          Habitaciones disponibles
        </h2>
        {loading ? <Spinner /> : tiposOrdenados.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '40px 0' }}>
            No hay habitaciones disponibles ahora mismo.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {tiposOrdenados.map(t => (
              <div key={t.tipo} className="glass" style={{ display: 'flex', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.10)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.05)'}
              >
                <div style={{ flex: 1, padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#2C3E50' }}>Habitación {t.tipo}</h3>
                      {t.tipo === 'Suite' && <span style={{ fontSize: '10px', background: '#f0fdf4', color: '#27AE60', padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(46,204,113,0.3)', fontWeight: 700, textTransform: 'uppercase' }}>Premium</span>}
                    </div>
                    <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#666', lineHeight: 1.5 }}>{DESCRIPCIONES[t.tipo]}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {(TAGS[t.tipo] || []).map(tag => (
                        <span key={tag} style={{ fontSize: '10px', background: 'rgba(46,204,113,0.08)', color: '#27AE60', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(46,204,113,0.15)', fontWeight: 500 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Desde</p>
                      <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#2ECC71' }}>
                        {formatEuros(t.min_precio)}<span style={{ fontSize: '12px', fontWeight: 400, color: '#aaa' }}> / noche</span>
                      </p>
                    </div>
                    <button className="btn-primary" onClick={() => nav('/habitaciones')} style={{ padding: '10px 24px', fontSize: '13px' }}>
                      Reservar →
                    </button>
                  </div>
                </div>
                <div style={{ width: '280px', minHeight: '200px', flexShrink: 0 }}>
                  <img src={IMG_MAP[t.tipo] || '/img/individual.png'} alt={`Habitación ${t.tipo}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}