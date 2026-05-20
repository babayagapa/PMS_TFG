import api from './axios'

export const loginApi = (email, password) => api.post('/login', { email, password })
export const registerApi = (data) => api.post('/register', data)
export const registerPersonalApi = (data) => api.post('/personal/register', data)
export const logoutApi = () => api.post('/logout')
export const getMeApi = () => api.get('/me')






