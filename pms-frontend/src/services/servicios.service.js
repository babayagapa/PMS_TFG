import api from './axios'

export const getServicios = () => api.get('/servicios')