import api from './axios'

export const getServicios  = ()         => api.get('/servicios')
export const getServicio   = (id)       => api.get(`/servicios/${id}`)
export const createServicio = (data)    => api.post('/servicios', data)
export const updateServicio = (id, d)   => api.put(`/servicios/${id}`, d)
export const deleteServicio = (id)      => api.delete(`/servicios/${id}`)
