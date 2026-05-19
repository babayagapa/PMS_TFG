# PMS_TFG — Sistema de Gestion Hotelera

TFG de Mario Gomez (@babayagapa) | 2 DAW | IES Venancio Blanco, Salamanca

Sistema web para gestionar habitaciones y reservas de un hotel.
React + Laravel + MongoDB + Docker.

---

## Requisitos

- Docker Desktop instalado y en ejecucion
- Git

No hace falta tener PHP, Node ni MongoDB instalados en local.
Docker lo gestiona todo.

---

## Arrancar el proyecto (primera vez)

```bash
# 1. Clonar el repositorio
git clone https://github.com/babayagapa/PMS_TFG.git
cd PMS_TFG

# 2. Crear el archivo de variables de entorno
cp .env.example .env

# 3. Construir y levantar los contenedores
docker-compose up -d --build
```

El contenedor del backend genera automaticamente las claves y puebla
la base de datos en el primer arranque. Espera unos 30-60 segundos.

```bash
# 4. Comprobar que todo funciona
docker-compose logs backend
# Debe mostrar: "Iniciando Laravel en 0.0.0.0:8000..."

# 5. Verificar la API
curl http://localhost:8000/api/habitaciones
# Debe devolver un array JSON con 12 habitaciones
```

Abrir en el navegador: **http://localhost:5173**

---

## Credenciales de prueba

| Rol           | Email                  | Password |
|---------------|------------------------|----------|
| Admin         | admin@hotel.com        | admin123 |
| Recepcionista | recepcion@hotel.com    | recep123 |
| Limpieza      | limpieza@hotel.com     | limp123  |

---

## Arranques posteriores

```bash
# Levantar (sin reconstruir)
docker-compose up -d

# Parar
docker-compose down

# Ver logs en tiempo real
docker-compose logs -f backend
```

---

## Si algo sale mal

```bash
# Reconstruir los contenedores desde cero
docker-compose down -v
docker-compose up -d --build

# Ejecutar seeders manualmente
docker exec pms_backend php artisan db:seed --force

# Regenerar claves manualmente
docker exec pms_backend php artisan key:generate --force
docker exec pms_backend php artisan jwt:secret --force
```

---

## Servicios

| URL                        | Servicio              |
|----------------------------|-----------------------|
| http://localhost:5173      | Frontend React        |
| http://localhost:8000/api  | API Laravel           |
| http://localhost:8081      | Panel MongoDB         |

---

## Arquitectura

```
Navegador → React (5173) → Axios → Laravel API (8000) → MongoDB (27017)
```

---

## Backup de datos

```bash
docker exec pms_mongo mongoexport \
  --db pms_db --collection reservas \
  --out /tmp/backup.json
docker cp pms_mongo:/tmp/backup.json ./backup_$(date +%Y%m%d).json
```

---

## Acceso remoto (Cloudflare Tunnel)

Para mostrar el proyecto desde otro equipo sin desplegarlo:

```bash
# Ver tu IP local
hostname -I | awk '{print $1}'

# Crear tunnel publico temporal
cloudflared tunnel --url http://localhost:5173
```

Genera un enlace publico que apunta a tu equipo.
Util para mostrarlo en el instituto teniendo el servidor en casa.

---

## Ramas

- `main` — codigo estable
- `develop` — desarrollo activo

## Acceso remoto con Cloudflare Tunnel
- mariogomez.pms
Es el nombre de mi dominio ya que lo tengo desplegado ahi, al ser mi pc puede ser que lo tenga abierto en el momento o no por lo que no es consistente para poder verlo, para eso es mejor seguir los pasos de docker