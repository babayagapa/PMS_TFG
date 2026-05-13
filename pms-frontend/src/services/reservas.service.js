import api from './axios'

export const getReservas      = (params) => api.get('/reservas', { params })
export const getReserva       = (id)     => api.get(`/reservas/${id}`)
export const createReserva    = (data)   => api.post('/reservas', data)
export const cancelarReserva  = (id)     => api.delete(`/reservas/${id}`)
export const confirmarReserva = (id)     => api.patch(`/reservas/${id}/confirmar`)
