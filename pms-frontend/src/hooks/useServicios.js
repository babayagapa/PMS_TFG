import { useState, useEffect } from 'react'
import { getServicios } from '../services/servicios.service'
import toast from 'react-hot-toast'

export function useServicios() {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getServicios()
      .then(({ data }) => setServicios(data))
      .catch(() => toast.error('Error al cargar servicios'))
      .finally(() => setLoading(false))
  }, [])

  return { servicios, loading }
}