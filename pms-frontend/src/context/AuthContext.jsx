import { createContext, useContext, useState, useEffect } from 'react'
import { loginApi, registerApi, logoutApi, getMeApi } from '../services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [token, setToken]     = useState(localStorage.getItem('pms_token'))
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (token) {
      getMeApi()
        .then(({ data }) => setUsuario(data))
        .catch(() => {
          localStorage.removeItem('pms_token')
          setToken(null)
        })
        .finally(() => setCargando(false))
    } else {
      setCargando(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await loginApi(email, password)
    localStorage.setItem('pms_token', data.token)
    setToken(data.token)
    setUsuario(data.user)
    return data.user
  }

  const register = async (formData) => {
    const { data } = await registerApi(formData)
    localStorage.setItem('pms_token', data.token)
    setToken(data.token)
    setUsuario(data.user)
    return data.user
  }

  const logout = async () => {
    try { await logoutApi() } catch (_) {}
    localStorage.removeItem('pms_token')
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, token, cargando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
