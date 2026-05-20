import { useState, useEffect } from 'react'
import { getFacturas } from '../services/facturas.service'
import toast from 'react-hot-toast'

export function useFacturas() {
  const [facturas, setFacturas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getFacturas()
      .then(({ data }) => setFacturas(data))
      .catch(() => toast.error('Error al cargar facturas'))
      .finally(() => setLoading(false))
  }, [])

  return { facturas, loading }
}