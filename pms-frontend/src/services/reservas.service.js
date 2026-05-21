import api from './axios'

export const getReservas = (params) => api.get('/reservas', { params })
export const createReserva = (data) => api.post('/reservas', data)
export const cancelarReserva = (id) => api.delete(`/reservas/${id}`)
export const confirmarReserva = (id) => api.patch(`/reservas/${id}/confirmar`)
export const pagarReserva = (id, d) => api.post(`/reservas/${id}/pagar`, d)