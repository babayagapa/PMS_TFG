# MODULO 5 — FRONTEND COMPLETO
## Repositorio: babayagapa/PMS_TFG | Rama: develop

---

> REGLAS ANTES DE ESCRIBIR UNA SOLA LINEA:
>
> 1. TEMPLATE LITERALS en JavaScript/JSX:
>    Las cadenas con variables SIEMPRE usan backtick ` no comilla simple '.
>    CORRECTO:  api.get(`/habitaciones/${id}`)
>    INCORRECTO: api.get('/habitaciones/${id}')
>    INCORRECTO: api.get(/habitaciones/${id})
>
> 2. CLASSNAME con expresiones en JSX:
>    CORRECTO:  className={`clase-fija ${variable}`}
>    INCORRECTO: className={clase-fija }
>    INCORRECTO: className={'clase-fija ' + variable}
>
> 3. Sin tildes ni enie en comentarios ni strings.
>    NUNCA escribas Ã³, Ã©, Ã¡, Ã±. Si dudas, escribe sin tilde.

---

Reemplaza los siguientes archivos con el contenido exacto que se indica.

---

## ARCHIVO 1 — src/components/Badge.jsx

```jsx
const colores = {
  Limpia:           'bg-green-100 text-green-800',
  Sucia:            'bg-red-100 text-red-800',
  'En mantenimiento': 'bg-yellow-100 text-yellow-800',
  Pendiente:        'bg-blue-100 text-blue-800',
  Confirmada:       'bg-green-100 text-green-800',
  Cancelada:        'bg-gray-100 text-gray-600',
  ocupada:          'bg-red-100 text-red-800',
  disponible:       'bg-green-100 text-green-800',
}

export default function Badge({ estado }) {
  const color = colores[estado] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {estado}
    </span>
  )
}
```

---

## ARCHIVO 2 — src/services/axios.js

```js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
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
```

---

## ARCHIVO 3 — src/services/habitaciones.service.js

```js
import api from './axios'

export const getHabitaciones  = (params) => api.get('/habitaciones', { params })
export const getHabitacion    = (id)     => api.get(`/habitaciones/${id}`)
export const createHabitacion = (data)   => api.post('/habitaciones', data)
export const updateHabitacion = (id, d)  => api.put(`/habitaciones/${id}`, d)
export const deleteHabitacion = (id)     => api.delete(`/habitaciones/${id}`)
```

---

## ARCHIVO 4 — src/services/reservas.service.js

```js
import api from './axios'

export const getReservas      = (params) => api.get('/reservas', { params })
export const getReserva       = (id)     => api.get(`/reservas/${id}`)
export const createReserva    = (data)   => api.post('/reservas', data)
export const cancelarReserva  = (id)     => api.delete(`/reservas/${id}`)
export const confirmarReserva = (id)     => api.patch(`/reservas/${id}/confirmar`)
```

---

## ARCHIVO 5 — src/context/AuthContext.jsx

```jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { loginApi, logoutApi, getMeApi } from '../services/auth.service'

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

  const logout = async () => {
    try { await logoutApi() } catch (_) {}
    localStorage.removeItem('pms_token')
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, token, cargando, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

---

## ARCHIVO 6 — src/hooks/useHabitaciones.js

```js
import { useState, useEffect } from 'react'
import { getHabitaciones } from '../services/habitaciones.service'
import toast from 'react-hot-toast'

export function useHabitaciones(filtros = {}) {
  const [habitaciones, setHabitaciones] = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    setLoading(true)
    getHabitaciones(filtros)
      .then(({ data }) => setHabitaciones(data))
      .catch(() => toast.error('Error al cargar habitaciones'))
      .finally(() => setLoading(false))
  }, [JSON.stringify(filtros)])

  return { habitaciones, loading }
}
```

---

## ARCHIVO 7 — src/hooks/useReservas.js

```js
import { useState, useEffect } from 'react'
import { getReservas } from '../services/reservas.service'
import toast from 'react-hot-toast'

export function useReservas(filtros = {}) {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    setLoading(true)
    getReservas(filtros)
      .then(({ data }) => setReservas(data))
      .catch(() => toast.error('Error al cargar reservas'))
      .finally(() => setLoading(false))
  }, [JSON.stringify(filtros)])

  return { reservas, loading }
}
```

---

## ARCHIVO 8 — src/App.jsx

```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage      from './pages/LandingPage'
import LoginPage        from './pages/LoginPage'
import HabitacionesPage from './pages/HabitacionesPage'
import ReservasPage     from './pages/ReservasPage'
import ReservaFormPage  from './pages/ReservaFormPage'
import PanelPage        from './pages/PanelPage'
import Spinner          from './components/Spinner'

function PrivateRoute({ children }) {
  const { token, cargando } = useAuth()
  if (cargando) return <Spinner />
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/"               element={<LandingPage />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/habitaciones"   element={<HabitacionesPage />} />
        <Route path="/reservas"       element={<PrivateRoute><ReservasPage /></PrivateRoute>} />
        <Route path="/reservas/nueva" element={<PrivateRoute><ReservaFormPage /></PrivateRoute>} />
        <Route path="/panel"          element={<PrivateRoute><PanelPage /></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  )
}
```

---

## ARCHIVO 9 — src/components/HabitacionCard.jsx

```jsx
import Badge from './Badge'
import { useNavigate } from 'react-router-dom'
import { formatEuros } from '../utils/formatDate'

export default function HabitacionCard({ habitacion }) {
  const nav = useNavigate()
  const disponible = !habitacion.ocupada && habitacion.estado_limpieza === 'Limpia'

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="bg-primary h-32 flex items-center justify-center">
        <span className="text-white text-4xl font-bold">{habitacion.numero}</span>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-bold text-gray-800">Hab. {habitacion.numero}</p>
            <p className="text-sm text-gray-500">{habitacion.tipo}</p>
          </div>
          <Badge estado={disponible ? 'disponible' : 'ocupada'} />
        </div>
        <p className="text-lg font-bold text-secondary mb-1">
          {formatEuros(habitacion.precio_noche)}<span className="text-xs text-gray-500"> / noche</span>
        </p>
        <p className="text-xs text-gray-500 mb-3">
          Capacidad: {habitacion.capacidad} personas
        </p>
        {habitacion.amenidades && (
          <div className="flex flex-wrap gap-1 mb-3">
            {habitacion.amenidades.slice(0, 3).map((a) => (
              <span key={a} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{a}</span>
            ))}
          </div>
        )}
        <button
          disabled={!disponible}
          onClick={() => nav(`/reservas/nueva?id_habitacion=${habitacion._id}`)}
          className={`w-full py-2 rounded text-sm font-medium transition-colors ${
            disponible
              ? 'bg-secondary text-white hover:bg-yellow-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {disponible ? 'Reservar' : 'No disponible'}
        </button>
      </div>
    </div>
  )
}
```

---

## ARCHIVO 10 — src/pages/LoginPage.jsx

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login }               = useAuth()
  const nav                     = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      nav('/panel')
    } catch (_) {
      setError('Email o contrasena incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-primary">Iniciar sesion</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <input
          className="w-full border p-2 rounded mb-3 text-sm"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded mb-4 text-sm"
          type="password"
          placeholder="Contrasena"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded text-sm font-medium disabled:opacity-50"
        >
          {loading ? <Spinner /> : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
```

---

## ARCHIVO 11 — src/pages/LandingPage.jsx

```jsx
import { Link } from 'react-router-dom'
import Navbar from '../layouts/Navbar'
import HabitacionCard from '../components/HabitacionCard'
import Spinner from '../components/Spinner'
import { useHabitaciones } from '../hooks/useHabitaciones'

export default function LandingPage() {
  const { habitaciones, loading } = useHabitaciones()
  const destacadas = habitaciones.filter((h) => !h.ocupada).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-primary text-white py-16 px-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Bienvenido al Hotel PMS</h1>
        <p className="text-lg mb-8 opacity-90">Gestiona reservas y habitaciones desde un solo lugar</p>
        <div className="flex justify-center gap-4">
          <Link to="/habitaciones" className="bg-secondary text-white px-6 py-3 rounded font-medium hover:bg-yellow-600 transition-colors">
            Ver habitaciones
          </Link>
          <Link to="/login" className="border border-white text-white px-6 py-3 rounded font-medium hover:bg-white hover:text-primary transition-colors">
            Panel de recepcion
          </Link>
        </div>
      </section>

      <section className="py-12 px-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-6">Habitaciones disponibles</h2>
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destacadas.map((h) => (
              <HabitacionCard key={h._id} habitacion={h} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
```

---

## ARCHIVO 12 — src/pages/HabitacionesPage.jsx

```jsx
import { useState } from 'react'
import Navbar from '../layouts/Navbar'
import Spinner from '../components/Spinner'
import HabitacionCard from '../components/HabitacionCard'
import { useHabitaciones } from '../hooks/useHabitaciones'

export default function HabitacionesPage() {
  const [tipo, setTipo]       = useState('')
  const [ocupada, setOcupada] = useState('')

  const filtros = {}
  if (tipo)    filtros.tipo   = tipo
  if (ocupada !== '') filtros.ocupada = ocupada

  const { habitaciones, loading } = useHabitaciones(filtros)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-4">Habitaciones</h2>

        <div className="flex gap-3 mb-6">
          <select
            className="border rounded p-2 text-sm"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="Individual">Individual</option>
            <option value="Doble">Doble</option>
            <option value="Suite">Suite</option>
            <option value="Familiar">Familiar</option>
          </select>

          <select
            className="border rounded p-2 text-sm"
            value={ocupada}
            onChange={(e) => setOcupada(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="false">Solo disponibles</option>
            <option value="true">Solo ocupadas</option>
          </select>
        </div>

        {loading ? (
          <Spinner />
        ) : habitaciones.length === 0 ? (
          <p className="text-gray-500">No hay habitaciones con esos filtros.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {habitaciones.map((h) => (
              <HabitacionCard key={h._id} habitacion={h} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
```

---

## ARCHIVO 13 — src/pages/ReservasPage.jsx

```jsx
import Navbar from '../layouts/Navbar'
import Spinner from '../components/Spinner'
import Badge from '../components/Badge'
import { useReservas } from '../hooks/useReservas'
import { confirmarReserva, cancelarReserva } from '../services/reservas.service'
import { formatDate, formatEuros } from '../utils/formatDate'
import toast from 'react-hot-toast'

export default function ReservasPage() {
  const { reservas, loading } = useReservas()

  const handleConfirmar = async (id) => {
    try {
      await confirmarReserva(id)
      toast.success('Reserva confirmada')
      window.location.reload()
    } catch (_) {
      toast.error('No se pudo confirmar')
    }
  }

  const handleCancelar = async (id) => {
    if (!window.confirm('Cancelar esta reserva?')) return
    try {
      await cancelarReserva(id)
      toast.success('Reserva cancelada')
      window.location.reload()
    } catch (_) {
      toast.error('No se pudo cancelar')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Reservas</h2>
        {loading ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Huesped</th>
                  <th className="p-3 text-left">Habitacion</th>
                  <th className="p-3 text-left">Entrada</th>
                  <th className="p-3 text-left">Salida</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Estado</th>
                  <th className="p-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r) => (
                  <tr key={r._id} className="border-t">
                    <td className="p-3">{r.nombre_huesped}</td>
                    <td className="p-3">{r.id_habitacion}</td>
                    <td className="p-3">{formatDate(r.fecha_entrada)}</td>
                    <td className="p-3">{formatDate(r.fecha_salida)}</td>
                    <td className="p-3">{formatEuros(r.precio_total)}</td>
                    <td className="p-3"><Badge estado={r.estado} /></td>
                    <td className="p-3 flex gap-2">
                      {r.estado === 'Pendiente' && (
                        <button
                          onClick={() => handleConfirmar(r._id)}
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Confirmar
                        </button>
                      )}
                      {r.estado !== 'Cancelada' && (
                        <button
                          onClick={() => handleCancelar(r._id)}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
```

---

## ARCHIVO 14 — src/components/ReservaForm.jsx

```jsx
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createReserva } from '../services/reservas.service'
import { calcularPrecio } from '../utils/calcularPrecio'
import { formatEuros, hoy } from '../utils/formatDate'
import { useHabitaciones } from '../hooks/useHabitaciones'
import toast from 'react-hot-toast'

export default function ReservaForm() {
  const nav = useNavigate()
  const [params] = useSearchParams()

  const { habitaciones } = useHabitaciones({ ocupada: false })

  const [form, setForm] = useState({
    id_habitacion:    params.get('id_habitacion') || '',
    nombre_huesped:   '',
    email_huesped:    '',
    telefono_huesped: '',
    fecha_entrada:    '',
    fecha_salida:     '',
    num_huespedes:    1,
    notas:            '',
  })
  const [loading, setLoading] = useState(false)
  const [errores, setErrores] = useState({})

  const habitacionSel = habitaciones.find((h) => h._id === form.id_habitacion)
  const precio = habitacionSel && form.fecha_entrada && form.fecha_salida
    ? calcularPrecio(habitacionSel.precio_noche, form.fecha_entrada, form.fecha_salida)
    : null

  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))

  const validar = () => {
    const e = {}
    if (!form.id_habitacion)    e.id_habitacion    = 'Selecciona una habitacion'
    if (!form.nombre_huesped)   e.nombre_huesped   = 'El nombre es obligatorio'
    if (!form.email_huesped)    e.email_huesped    = 'El email es obligatorio'
    if (!form.telefono_huesped) e.telefono_huesped = 'El telefono es obligatorio'
    if (!form.fecha_entrada)    e.fecha_entrada    = 'La fecha de entrada es obligatoria'
    if (!form.fecha_salida)     e.fecha_salida     = 'La fecha de salida es obligatoria'
    if (form.fecha_entrada && form.fecha_salida && form.fecha_salida <= form.fecha_entrada) {
      e.fecha_salida = 'La salida debe ser posterior a la entrada'
    }
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validar()
    if (Object.keys(e2).length > 0) { setErrores(e2); return }

    setLoading(true)
    try {
      await createReserva(form)
      toast.success('Reserva creada correctamente')
      nav('/reservas')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al crear la reserva')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block text-sm font-medium mb-1">Habitacion</label>
        <select
          className="w-full border rounded p-2 text-sm"
          value={form.id_habitacion}
          onChange={(e) => set('id_habitacion', e.target.value)}
        >
          <option value="">Selecciona una habitacion</option>
          {habitaciones.map((h) => (
            <option key={h._id} value={h._id}>
              {h.numero} — {h.tipo} — {formatEuros(h.precio_noche)}/noche
            </option>
          ))}
        </select>
        {errores.id_habitacion && <p className="text-red-500 text-xs mt-1">{errores.id_habitacion}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nombre del huesped</label>
        <input className="w-full border rounded p-2 text-sm" type="text"
          value={form.nombre_huesped} onChange={(e) => set('nombre_huesped', e.target.value)} />
        {errores.nombre_huesped && <p className="text-red-500 text-xs mt-1">{errores.nombre_huesped}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input className="w-full border rounded p-2 text-sm" type="email"
          value={form.email_huesped} onChange={(e) => set('email_huesped', e.target.value)} />
        {errores.email_huesped && <p className="text-red-500 text-xs mt-1">{errores.email_huesped}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Telefono</label>
        <input className="w-full border rounded p-2 text-sm" type="tel"
          value={form.telefono_huesped} onChange={(e) => set('telefono_huesped', e.target.value)} />
        {errores.telefono_huesped && <p className="text-red-500 text-xs mt-1">{errores.telefono_huesped}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Fecha entrada</label>
          <input className="w-full border rounded p-2 text-sm" type="date"
            min={hoy()} value={form.fecha_entrada}
            onChange={(e) => set('fecha_entrada', e.target.value)} />
          {errores.fecha_entrada && <p className="text-red-500 text-xs mt-1">{errores.fecha_entrada}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fecha salida</label>
          <input className="w-full border rounded p-2 text-sm" type="date"
            min={form.fecha_entrada || hoy()} value={form.fecha_salida}
            onChange={(e) => set('fecha_salida', e.target.value)} />
          {errores.fecha_salida && <p className="text-red-500 text-xs mt-1">{errores.fecha_salida}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Numero de huespedes</label>
        <input className="w-full border rounded p-2 text-sm" type="number" min="1" max="10"
          value={form.num_huespedes} onChange={(e) => set('num_huespedes', parseInt(e.target.value))} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notas (opcional)</label>
        <textarea className="w-full border rounded p-2 text-sm" rows="2"
          value={form.notas} onChange={(e) => set('notas', e.target.value)} />
      </div>

      {precio && precio.noches > 0 && (
        <div className="bg-gray-50 border rounded p-4 text-sm">
          <p className="font-medium mb-2">Resumen del precio</p>
          <div className="flex justify-between text-gray-600">
            <span>{precio.noches} noches x {formatEuros(habitacionSel.precio_noche)}</span>
            <span>{formatEuros(precio.base)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>IVA (10%)</span>
            <span>{formatEuros(precio.iva)}</span>
          </div>
          <div className="flex justify-between font-bold text-primary mt-2 pt-2 border-t">
            <span>Total</span>
            <span>{formatEuros(precio.total)}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2 rounded font-medium disabled:opacity-50"
      >
        {loading ? 'Creando reserva...' : 'Crear reserva'}
      </button>

    </form>
  )
}
```

---

## ARCHIVO 15 — src/pages/ReservaFormPage.jsx

```jsx
import Navbar from '../layouts/Navbar'
import ReservaForm from '../components/ReservaForm'

export default function ReservaFormPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-6">Nueva reserva</h2>
        <div className="bg-white rounded shadow p-6">
          <ReservaForm />
        </div>
      </main>
    </div>
  )
}
```

---

## ARCHIVO 16 — src/pages/PanelPage.jsx

```jsx
import { useEffect, useState } from 'react'
import Sidebar from '../layouts/Sidebar'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { getHabitaciones } from '../services/habitaciones.service'
import { getReservas } from '../services/reservas.service'

export default function PanelPage() {
  const { usuario } = useAuth()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getHabitaciones(),
      getReservas(),
    ]).then(([habRes, resRes]) => {
      const habs = habRes.data
      const reservas = resRes.data
      setStats({
        total:       habs.length,
        ocupadas:    habs.filter((h) => h.ocupada).length,
        disponibles: habs.filter((h) => !h.ocupada).length,
        pendientes:  reservas.filter((r) => r.estado === 'Pendiente').length,
        confirmadas: reservas.filter((r) => r.estado === 'Confirmada').length,
        totalReservas: reservas.length,
      })
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Hola, {usuario?.nombre || 'Recepcionista'}
        </h2>
        <p className="text-gray-500 text-sm mb-6">Panel de control</p>

        {loading ? <Spinner /> : stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded shadow p-4">
              <p className="text-sm text-gray-500">Habitaciones totales</p>
              <p className="text-3xl font-bold text-primary">{stats.total}</p>
            </div>
            <div className="bg-white rounded shadow p-4">
              <p className="text-sm text-gray-500">Ocupadas</p>
              <p className="text-3xl font-bold text-red-500">{stats.ocupadas}</p>
            </div>
            <div className="bg-white rounded shadow p-4">
              <p className="text-sm text-gray-500">Disponibles</p>
              <p className="text-3xl font-bold text-green-500">{stats.disponibles}</p>
            </div>
            <div className="bg-white rounded shadow p-4">
              <p className="text-sm text-gray-500">Reservas totales</p>
              <p className="text-3xl font-bold text-primary">{stats.totalReservas}</p>
            </div>
            <div className="bg-white rounded shadow p-4">
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-500">{stats.pendientes}</p>
            </div>
            <div className="bg-white rounded shadow p-4">
              <p className="text-sm text-gray-500">Confirmadas</p>
              <p className="text-3xl font-bold text-green-500">{stats.confirmadas}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
```

---
## COMMIT

```bash
git add .
git commit -m "Frontend"
```

---

## RESULTADO ESPERADO

Al terminar este modulo la aplicacion es completamente funcional:
- Login con JWT y redireccion automatica
- Listado de habitaciones con filtros
- Formulario de reserva con calculo de precio en tiempo real
- Tabla de reservas con acciones confirmar/cancelar
- Panel con estadisticas reales de la base de datos
- Rutas privadas protegidas

Archivos modificados (16 en total):
- src/components/Badge.jsx
- src/services/axios.js
- src/services/habitaciones.service.js
- src/services/reservas.service.js
- src/context/AuthContext.jsx
- src/hooks/useHabitaciones.js
- src/hooks/useReservas.js
- src/App.jsx
- src/components/HabitacionCard.jsx
- src/pages/LoginPage.jsx
- src/pages/LandingPage.jsx
- src/pages/HabitacionesPage.jsx
- src/pages/ReservasPage.jsx
- src/components/ReservaForm.jsx
- src/pages/ReservaFormPage.jsx
- src/pages/PanelPage.jsx