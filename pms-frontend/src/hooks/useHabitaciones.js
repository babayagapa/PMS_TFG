import { useState, useEffect } from 'react'
import { getHabitaciones } from '../services/habitaciones.service'
import toast from 'react-hot-toast'

export function useHabitaciones(filtros = {}) {
  const [habitaciones, setHabitaciones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getHabitaciones(filtros)
      .then(({ data }) => setHabitaciones(data))
      .catch(() => toast.error('Error al cargar habitaciones'))
      .finally(() => setLoading(false))
  }, [JSON.stringify(filtros)])

  return { habitaciones, loading }
}