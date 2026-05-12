import axios from 'axios'

// Instancia central de Axios con el token JWT automÃ¡tico
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

// TODO: interceptor request â†’ aÃ±adir Authorization: Bearer <token>
// TODO: interceptor response â†’ si 401, borrar token y redirigir a /login

export default api