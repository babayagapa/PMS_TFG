import axios from 'axios'

// Instancia central de Axios con el token JWT automático
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

// TODO: interceptor request → añadir Authorization: Bearer <token>
// TODO: interceptor response → si 401, borrar token y redirigir a /login

export default api