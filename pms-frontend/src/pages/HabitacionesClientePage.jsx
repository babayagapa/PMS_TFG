import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../layouts/Navbar'
import Spinner from '../components/Spinner'
import { useHabitaciones } from '../hooks/useHabitaciones'
import { useReservas } from '../hooks/useReservas'
import { formatEuros, hoy } from '../utils/formatDate'

const IMG_MAP = {
  Individual: '/img/individual.png',
  Doble:      '/img/doble.png',
  Suite:      '/img/suite.png',
  Familiar:   '/img/familiar.png',
}

const DESCRIPCIONES = {
  Individual: 'Habitacion acogedora con cama individual, ideal para viajeros de negocios. Equipada con escritorio de trabajo y todas las comodidades esenciales.',
  Doble:      'Espaciosa habitacion con cama de matrimonio o dos camas, perfecta para parejas o amigos. Disfruta de un ambiente luminoso y confortable.',
  Suite:      'Una experiencia incomparable con salon privado, terraza panoramica y acabados de lujo disenados para la maxima relajacion.',
  Familiar:   'Ideal para familias, con amplio espacio, zona infantil y todas las comodidades modernas para una estancia inolvidable.',
}

const TAGS = {
  Individual: ['WiFi Alta Velocidad', 'Escritorio', 'Capacidad: 1 Persona'],
  Doble:      ['WiFi Alta Velocidad', 'Cama Queen', 'Capacidad: 2 Personas'],
  Suite:      ['WiFi Alta Velocidad', 'Jacuzzi Privado', 'Terraza', 'Capacidad: 2 Personas'],
  Familiar:   ['WiFi Alta Velocidad', 'Smart TV', 'Nevera', 'Capacidad: 4 Personas'],
}

export default function HabitacionesClientePage() {
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const { habitaciones, loading: loadHab } = useHabitaciones()
  const { reservas } = useReservas()

  const [entrada, setEntrada]     = useState(searchParams.get('entrada') || '')
  const [salida, setSalida]       = useState(searchParams.get('salida') || '')
  const [huespedes, setHuespedes] = useState(searchParams.get('huespedes') || '2')

  // Agrupar habitaciones por tipo y calcular la mas barata de cada tipo
  const tiposDisponibles = useMemo(() => {
    let habsFiltradas = habitaciones.filter(h => !h.ocupada && h.estado_limpieza === 'Limpia')

    // Si hay fechas, filtrar por conflictos con reservas
    if (entrada && salida) {
      const reservasActivas = reservas.filter(r => r.estado !== 'Cancelada')
      habsFiltradas = habsFiltradas.filter(h => {
        const conflicto = reservasActivas.some(r =>
          r.id_habitacion === h._id &&
          r.fecha_entrada < salida &&
          r.fecha_salida > entrada
        )
        return !conflicto
      })
    }

    // Filtrar por capacidad
    if (huespedes) {
      habsFiltradas = habsFiltradas.filter(h => h.capacidad >= parseInt(huespedes))
    }

    // Agrupar por tipo
    const agrupado = {}
    habsFiltradas.forEach(h => {
      if (!agrupado[h.tipo]) {
        agrupado[h.tipo] = { tipo: h.tipo, min_precio: h.precio_noche, count: 0, habitaciones: [] }
      }
      agrupado[h.tipo].count++
      agrupado[h.tipo].habitaciones.push(h)
      if (h.precio_noche < agrupado[h.tipo].min_precio) {
        agrupado[h.tipo].min_precio = h.precio_noche
      }
    })

    return Object.values(agrupado)
  }, [habitaciones, reservas, entrada, salida, huespedes])

  const handleReservar = (tipo) => {
    const hab = tiposDisponibles.find(t => t.tipo === tipo)
    if (!hab || hab.habitaciones.length === 0) return
    const params = new URLSearchParams()
    params.set('id_habitacion', hab.habitaciones[0]._id)
    if (entrada) params.set('fecha_entrada', entrada)
    if (salida) params.set('fecha_salida', salida)
    nav(`/reservas/nueva?${params.toString()}`)
  }

  const orden = ['Suite', 'Familiar', 'Doble', 'Individual']
  const tiposOrdenados = [...tiposDisponibles].sort((a, b) =>
    orden.indexOf(a.tipo) - orden.indexOf(b.tipo)
  )

  return (
    <div className="page">
      <Navbar />

      {/* Buscador */}
      <section
        className="glass"
        style={{ display: 'flex', gap: '20px', padding: '30px 40px', alignItems: 'flex-end', marginBottom: '40px' }}
      >
        <div className="input-group">
          <label className="input-label">Fecha de Entrada</label>
          <input type="date" className="input-field" min={hoy()} value={entrada} onChange={e => setEntrada(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Fecha de Salida</label>
          <input type="date" className="input-field" min={entrada || hoy()} value={salida} onChange={e => setSalida(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Huespedes</label>
          <select className="input-field" value={huespedes} onChange={e => setHuespedes(e.target.value)}>
            <option value="1">1 Huesped</option>
            <option value="2">2 Huespedes</option>
            <option value="3">3 Huespedes</option>
            <option value="4">4 Huespedes</option>
            <option value="5">5+ Huespedes</option>
          </select>
        </div>
        <button className="btn-primary" style={{ height: '47px', padding: '0 40px', whiteSpace: 'nowrap' }}
          onClick={() => {}}>
          Buscar
        </button>
      </section>

      {/* Listado de tipos de habitacion */}
      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
          {entrada && salida ? 'Habitaciones disponibles para tus fechas' : 'Nuestras habitaciones'}
        </h2>

        {loadHab ? <Spinner /> : tiposOrdenados.length === 0 ? (
          <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>😕</p>
            <p style={{ color: '#999', fontSize: '15px' }}>No hay habitaciones disponibles para las fechas seleccionadas.</p>
            <p style={{ color: '#bbb', fontSize: '13px', marginTop: '8px' }}>Prueba con otras fechas o menos huespedes.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {tiposOrdenados.map(t => (
              <div key={t.tipo} className="glass" style={{
                display: 'flex', overflow: 'hidden', transition: 'box-shadow 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.10)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.05)'}
              >
                {/* Contenido izquierda */}
                <div style={{ flex: 1, padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#2C3E50' }}>
                        Habitacion {t.tipo}
                      </h3>
                      {t.tipo === 'Suite' && (
                        <span style={{ fontSize: '11px', background: '#f0fdf4', color: '#27AE60', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(46,204,113,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Premium</span>
                      )}
                      {t.tipo === 'Doble' && (
                        <span style={{ fontSize: '11px', background: 'rgba(243,156,18,0.08)', color: '#e67e22', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(243,156,18,0.2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Popular</span>
                      )}
                    </div>
                    <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#666', lineHeight: 1.6, maxWidth: '400px' }}>
                      {DESCRIPCIONES[t.tipo]}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                      {(TAGS[t.tipo] || []).map(tag => (
                        <span key={tag} style={{ fontSize: '11px', background: 'rgba(46,204,113,0.08)', color: '#27AE60', padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(46,204,113,0.15)', fontWeight: 500 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Desde</p>
                      <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#2ECC71' }}>
                        {formatEuros(t.min_precio)}
                        <span style={{ fontSize: '13px', fontWeight: 400, color: '#aaa' }}> / noche</span>
                      </p>
                    </div>
                    <button className="btn-primary" onClick={() => handleReservar(t.tipo)}
                      style={{ padding: '12px 28px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Reservar →
                    </button>
                  </div>
                </div>

                {/* Imagen derecha */}
                <div style={{ width: '340px', minHeight: '240px', flexShrink: 0 }}>
                  <img
                    src={IMG_MAP[t.tipo] || '/img/individual.png'}
                    alt={`Habitacion ${t.tipo}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
