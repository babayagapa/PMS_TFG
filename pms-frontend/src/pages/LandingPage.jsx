import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* HERO */}
      <section className="bg-surface px-8 py-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">

          {/* Texto */}
          <div className="flex-1">
            <h1 className="text-5xl font-extrabold text-dark leading-tight mb-6">
              Gestion inteligente, estancias perfectas.
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md">
              El Property Management System disenado para simplificar tus reservas,
              automatizar tareas y mejorar la experiencia de tus huespedes desde el primer clic.
            </p>
            <Link
              to="/habitaciones"
              className="inline-block bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-dark transition-colors shadow-lg"
            >
              Reservar Habitacion
            </Link>
          </div>

          {/* Imagen placeholder */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-sm h-72 rounded-2xl border-2 border-dashed border-primary bg-surface flex items-center justify-center">
              <span className="text-primary font-medium text-sm">[Imagen de la Habitacion]</span>
            </div>
          </div>

        </div>
      </section>

      {/* BUSCADOR */}
      <section className="px-8 py-6 bg-surface">
        <div className="max-w-4xl mx-auto glass rounded-2xl shadow-md px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">

            <div className="flex-1">
              <label className="block text-sm font-semibold text-dark mb-2">
                Fecha de Entrada
              </label>
              <input
                type="date"
                min={hoy()}
                value={entrada}
                onChange={e => setEntrada(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-dark mb-2">
                Fecha de Salida
              </label>
              <input
                type="date"
                min={entrada || hoy()}
                value={salida}
                onChange={e => setSalida(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-dark mb-2">
                Numero de Huespedes
              </label>
              <select
                value={huespedes}
                onChange={e => setHuespedes(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="1">1 Huesped</option>
                <option value="2">2 Huespedes</option>
                <option value="3">3 Huespedes</option>
                <option value="4">4 Huespedes</option>
                <option value="5">5+ Huespedes</option>
              </select>
            </div>

            <button
              onClick={handleBuscar}
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors whitespace-nowrap shadow-md"
            >
              Buscar
            </button>

          </div>
        </div>
      </section>

      {/* HABITACIONES DESTACADAS */}
      <section className="px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-dark mb-6">Habitaciones disponibles</h2>
          {loading ? (
            <Spinner />
          ) : destacadas.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay habitaciones disponibles ahora mismo.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {destacadas.map(h => (
                <HabitacionCard key={h._id} habitacion={h} />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
