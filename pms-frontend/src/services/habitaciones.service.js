import api from './axios'

export const getHabitaciones  = (params) => api.get('/habitaciones', { params })
export const getHabitacion    = (id)     => api.get(/habitaciones/${id})
export const createHabitacion = (data)   => api.post('/habitaciones', data)
export const updateHabitacion = (id, d)  => api.put(/habitaciones/${id}, d)
export const deleteHabitacion = (id)     => api.delete(/habitaciones/${id})