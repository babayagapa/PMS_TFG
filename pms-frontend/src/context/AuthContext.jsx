import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [token, setToken]     = useState(localStorage.getItem('pms_token'))

  // TODO: implementar login(), logout() y verificación inicial con GET /api/me

  return (
    <AuthContext.Provider value={{ usuario, token, setUsuario, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)