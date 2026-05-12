import { useState, useEffect } from 'react'
import { getHabitaciones } from '../services/habitaciones.service'

// Hook para obtener y filtrar habitaciones
export function useHabitaciones(filtros = {}) {
  const [habitaciones, setHabitaciones] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  // TODO: fetch al montar y al cambiar filtros
  // TODO: manejar error con toast

  return { habitaciones, loading, error }
}