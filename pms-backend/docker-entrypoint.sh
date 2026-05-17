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

if [ ! -f "vendor/autoload.php" ]; then
  echo "Instalando dependencias de Composer..."
  composer install --no-interaction --optimize-autoloader
fi

if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
  echo "Generando APP_KEY..."
  php artisan key:generate --force --no-interaction
fi

if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "" ]; then
  echo "Generando JWT_SECRET..."
  php artisan jwt:secret --force --no-interaction
fi

echo "Limpiando cache..."
php artisan optimize:clear --no-interaction 2>/dev/null || true

echo "Ejecutando seeders..."
php artisan db:seed --force --no-interaction
echo "Seeders completados."

echo "--- Iniciando Laravel en 0.0.0.0:8000 ---"
exec php artisan serve --host=0.0.0.0 --port=8000