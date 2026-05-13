import { useState, useEffect } from 'react'
import { getReservas } from '../services/reservas.service'
import toast from 'react-hot-toast'

export function useReservas(filtros = {}) {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    setLoading(true)
    getReservas(filtros)
      .then(({ data }) => setReservas(data))
      .catch(() => toast.error('Error al cargar reservas'))
      .finally(() => setLoading(false))
  }, [JSON.stringify(filtros)])

  return { reservas, loading }
}
