# PMS_TFG - Sistema de Gestión Hotelera
TFG de Mario Gomez (@babayagapa) | 2º DAW

## Qué es
Aplicación web para gestionar habitaciones y reservas de un hotel.
React en el frontend, Laravel en el backend, MongoDB como base de datos.

## Cómo arrancar
1. `cp .env.example .env`
2. `docker-compose up -d`
3. `docker exec pms_backend php artisan key:generate`
4. `docker exec pms_backend php artisan jwt:secret`
5. `docker exec pms_backend php artisan db:seed`
6. Abrir http://localhost:5173

## Usuarios de prueba
- admin@hotel.com / admin123 (admin)
- recepcion@hotel.com / recep123 (recepcionista)

## Arquitectura
```text
React (5173) → Axios → Laravel API (8000) → MongoDB (27017)
```

## Ramas
- `main` → estable
- `develop` → desarrollo
- `feature/auth` → login y JWT
- `feature/habitaciones` → habitaciones
- `feature/reservas` → reservas

## Backup de datos
```bash
docker exec pms_mongo mongoexport --db pms_db --collection reservas --out /tmp/bk.json
docker cp pms_mongo:/tmp/bk.json ./backup_$(date +%Y%m%d).json
```

## Acceso remoto con Cloudflare Tunnel
Para abrir el proyecto desde otro sitio sin desplegar nada:
```bash
# Detecta tu IP local
hostname -I | awk '{print $1}'
# Lanza el tunnel apuntando al frontend
cloudflared tunnel --url http://<TU_IP>:5173
```
Te genera un enlace público temporal. Útil para mostrarlo en el instituto
sirviendo desde tu propio PC.