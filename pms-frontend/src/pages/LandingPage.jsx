import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../layouts/Navbar'
import HabitacionCard from '../components/HabitacionCard'
import Spinner from '../components/Spinner'
import { useHabitaciones } from '../hooks/useHabitaciones'
import { hoy } from '../utils/formatDate'

export default function LandingPage() {
  const nav = useNavigate()
  const { habitaciones, loading } = useHabitaciones()
  const destacadas = habitaciones.filter(h => !h.ocupada).slice(0, 3)

  const [entrada,   setEntrada]   = useState('')
  const [salida,    setSalida]    = useState('')
  const [huespedes, setHuespedes] = useState('2')

  const handleBuscar = () => {
    const params = new URLSearchParams()
    if (entrada)   params.set('entrada',   entrada)
    if (salida)    params.set('salida',    salida)
    if (huespedes) params.set('huespedes', huespedes)
    nav(`/habitaciones?${params.toString()}`)
  }

  return (
    <div className="page">
      <Navbar />

      {/* HERO — copia exacta del mockup */}
      <header
        className="glass"
        style={{
          display: 'flex',
          gap: '50px',
          padding: '60px 40px',
          marginBottom: '40px',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '3.5rem', marginTop: 0, marginBottom: '20px', lineHeight: 1.1, letterSpacing: '-1px' }}>
            Gestion inteligente,<br />estancias perfectas.
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '40px', lineHeight: 1.5, maxWidth: '420px' }}>
            El Property Management System disenado para simplificar tus reservas,
            automatizar tareas y mejorar la experiencia de tus huespedes desde el primer clic.
          </p>
          <button className="btn-primary" onClick={() => nav('/habitaciones')}>
            Reservar Habitacion
          </button>
        </div>

        <div
          style={{
            flex: 1,
            height: '350px',
            background: 'rgba(46, 204, 113, 0.15)',
            border: '2px dashed rgba(46, 204, 113, 0.4)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2ECC71',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          [Imagen Representativa de la Habitacion]
        </div>
      </header>

      {/* BUSCADOR — copia exacta del mockup */}
      <section
        className="glass"
        style={{
          display: 'flex',
          gap: '20px',
          padding: '30px 40px',
          alignItems: 'flex-end',
          marginBottom: '40px',
        }}
      >
        <div className="input-group">
          <label className="input-label">Fecha de Entrada</label>
          <input
            type="date"
            className="input-field"
            min={hoy()}
            value={entrada}
            onChange={e => setEntrada(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Fecha de Salida</label>
          <input
            type="date"
            className="input-field"
            min={entrada || hoy()}
            value={salida}
            onChange={e => setSalida(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Numero de Huespedes</label>
          <select
            className="input-field"
            value={huespedes}
            onChange={e => setHuespedes(e.target.value)}
          >
            <option value="1">1 Huesped</option>
            <option value="2">2 Huespedes</option>
            <option value="3">3 Huespedes</option>
            <option value="4">4 Huespedes</option>
            <option value="5">5+ Huespedes</option>
          </select>
        </div>

        <button
          className="btn-primary"
          onClick={handleBuscar}
          style={{ height: '47px', padding: '0 40px', whiteSpace: 'nowrap' }}
        >
          Buscar
        </button>
      </section>

      {/* HABITACIONES DESTACADAS */}
      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
          Habitaciones disponibles
        </h2>
        {loading ? (
          <Spinner />
        ) : destacadas.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '40px 0' }}>
            No hay habitaciones disponibles ahora mismo.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {destacadas.map(h => (
              <HabitacionCard key={h._id} habitacion={h} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
