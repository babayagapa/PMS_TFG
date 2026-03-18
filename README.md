# PMS TFG – Sistema de Gestión Hotelera

Sistema de Gestión de Propiedades Hoteleras (_Property Management System_) desarrollado como Trabajo de Fin de Grado.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Tailwind CSS 3 (Vite) |
| Backend | Laravel 11 (API REST) + PHP 8.2 |
| Base de datos | MongoDB 7 |
| Infraestructura | Docker / Docker Compose |

---

## Estructura del proyecto

```
PMS_TFG/
├── docker-compose.yml          # Orquestación de todos los servicios
├── backend/                    # API REST en Laravel
│   ├── Dockerfile
│   ├── nginx/default.conf      # Configuración de Nginx
│   ├── app/
│   │   ├── Models/
│   │   │   ├── User.php        # Modelo Usuario (roles: Administrador, Recepcionista, Limpieza, Cliente)
│   │   │   ├── Room.php        # Modelo Habitación
│   │   │   └── Reservation.php # Modelo Reserva
│   │   └── Http/Controllers/
│   │       ├── AuthController.php
│   │       ├── RoomController.php
│   │       ├── ReservationController.php
│   │       └── UserController.php
│   ├── config/database.php     # Configuración MongoDB
│   ├── routes/api.php          # Rutas REST
│   ├── composer.json
│   └── .env.example
└── frontend/                   # SPA React
    ├── Dockerfile
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.js
    └── src/
        ├── App.jsx              # Router con rutas protegidas por rol
        ├── context/AuthContext.jsx
        ├── components/ProtectedRoute.jsx
        ├── services/api.js
        └── pages/
            ├── auth/LoginPage.jsx
            ├── admin/           # Administrador
            ├── receptionist/    # Recepcionista
            ├── housekeeping/    # Limpieza
            └── client/          # Cliente
```

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ≥ 24 (incluye Docker Compose v2)

---

## Levantar el proyecto con Docker

### 1. Clonar el repositorio

```bash
git clone https://github.com/babayagapa/PMS_TFG.git
cd PMS_TFG
```

### 2. Configurar variables de entorno del backend

```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env` y ajusta las credenciales si es necesario. Luego genera la clave de aplicación Laravel:

```bash
docker compose run --rm backend php artisan key:generate
```

### 3. Construir e iniciar todos los servicios

```bash
docker compose up --build
```

Esto levantará:

| Servicio | URL local |
|----------|-----------|
| Frontend (Vite dev) | http://localhost:5173 |
| API REST (Laravel) | http://localhost:8000/api |
| MongoDB | mongodb://localhost:27017 |

### 4. Detener los servicios

```bash
docker compose down
```

Para eliminar también los volúmenes de datos:

```bash
docker compose down -v
```

---

## Comandos útiles

```bash
# Acceder al contenedor del backend
docker compose exec backend sh

# Ejecutar comandos Artisan
docker compose exec backend php artisan migrate
docker compose exec backend php artisan tinker

# Ver logs en tiempo real
docker compose logs -f

# Ejecutar tests del backend
docker compose exec backend php artisan test
```

---

## Modelos de datos

### Usuario (`users`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId | Identificador MongoDB |
| `nombre` | string | Nombre |
| `apellidos` | string | Apellidos |
| `nif` | string (único) | DNI/NIE |
| `email` | string (único) | Correo electrónico |
| `password` | string | Contraseña (hash bcrypt) |
| `rol` | enum | `Administrador` \| `Recepcionista` \| `Limpieza` \| `Cliente` |

### Habitación (`rooms`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId | Identificador MongoDB |
| `numero` | int (único) | Número de habitación |
| `tipo` | enum | `Individual` \| `Doble` \| `Suite` |
| `precio_noche` | float | Precio por noche (EUR) |
| `estado_limpieza` | enum | `Limpia` \| `Sucia` \| `Mantenimiento` |
| `estado_ocupacion` | enum | `Libre` \| `Ocupada` |

### Reserva (`reservations`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId | Identificador MongoDB |
| `cliente_id` | ObjectId | Referencia al usuario Cliente |
| `habitacion_id` | ObjectId | Referencia a la Habitación |
| `fecha_entrada` | datetime | Fecha de check-in |
| `fecha_salida` | datetime | Fecha de check-out |
| `precio_total` | float | Precio total calculado |
| `estado` | enum | `Confirmada` \| `Cancelada` \| `Finalizada` |

---

## Accesibilidad

Todos los componentes del frontend deben cumplir los estándares **WCAG 2.1 Nivel A**:

- Usar elementos HTML semánticos (`<main>`, `<nav>`, `<header>`, `<section>`, etc.).
- Asociar cada `<input>` con su `<label>` mediante `htmlFor`/`id`.
- Comunicar estados dinámicos con `aria-live`, `role="alert"` o `role="status"`.
- Nunca usar el color como único medio de transmitir información.
- Garantizar que todos los controles sean accesibles por teclado.

---

## Licencia

MIT