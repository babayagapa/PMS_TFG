#!/bin/sh
set -e

echo "--- Esperando a MongoDB ---"
i=0
while [ $i -lt 60 ]; do
  if nc -z mongo 27017 2>/dev/null; then
    echo "MongoDB listo."
    break
  fi
  echo "Intento $i/60, esperando..."
  i=$((i+1))
  sleep 2
done

cd /var/www/html

# Instalar dependencias si no existen (el volumen borra el vendor/ del build)
if [ ! -f "vendor/autoload.php" ]; then
  echo "Instalando dependencias..."
  composer install --no-interaction --optimize-autoloader
fi

# Generar claves solo si no estan definidas
if [ -z "$APP_KEY" ]; then
  echo "Generando APP_KEY..."
  php artisan key:generate --force --no-interaction
fi

if [ -z "$JWT_SECRET" ]; then
  echo "Generando JWT_SECRET..."
  php artisan jwt:secret --force --no-interaction
fi

# Limpiar cache de configuracion en cada arranque
php artisan config:clear --no-interaction 2>/dev/null || true

# Solo sembrar si la coleccion de habitaciones esta vacia
HAB_COUNT=$(php artisan tinker --execute="echo App\Models\Habitacion::count();" 2>/dev/null | tail -1 || echo "0")
if [ "$HAB_COUNT" = "0" ]; then
  echo "Base de datos vacia, ejecutando seeders..."
  php artisan db:seed --force --no-interaction
  echo "Datos iniciales cargados."
else
  echo "Base de datos ya tiene datos ($HAB_COUNT habitaciones), saltando seed."
fi

echo "--- Iniciando Laravel en 0.0.0.0:8000 ---"
exec php artisan serve --host=0.0.0.0 --port=8000
