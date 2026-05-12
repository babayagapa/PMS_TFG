import { useState, useEffect } from 'react'
import { getReservas } from '../services/reservas.service'

// Hook para obtener reservas
export function useReservas(filtros = {}) {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading]   = useState(true)

  // TODO: fetch al montar

  return { reservas, loading }
}