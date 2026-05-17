import axios from 'axios'

// URL relativa: usa el proxy de Vite en desarrollo
// Vite reenvía /api/* a http://backend:8000 (red interna Docker)
// Esto elimina los errores de CORS completamente
const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pms_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pms_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
