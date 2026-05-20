import api from './axios'

export const getFacturas = (params) => api.get('/facturas', { params })
export const getFactura = (id) => api.get(`/facturas/${id}`)





