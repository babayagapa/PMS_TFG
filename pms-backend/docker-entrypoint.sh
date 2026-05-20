#!/bin/sh
set -e

echo "Esperando a MongoDB..."
i=0
while [ $i -lt 30 ]; do
  if nc -z mongo 27017 2>/dev/null; then
    echo "MongoDB listo."
    break
  fi
  i=$((i+1))
  sleep 2
done

cd /var/www/html

if [ ! -f "vendor/autoload.php" ]; then
  echo "Instalando dependencias..."
  composer install --no-interaction --optimize-autoloader
fi

if [ -z "$APP_KEY" ]; then
  php artisan key:generate --force --no-interaction
fi

if [ -z "$JWT_SECRET" ]; then
  php artisan jwt:secret --force --no-interaction
fi

php artisan config:clear --no-interaction 2>/dev/null || true

HAB_COUNT=$(php -r "require 'vendor/autoload.php'; (require 'bootstrap/app.php')->make('Illuminate\Contracts\Console\Kernel')->bootstrap(); echo App\Models\Habitacion::count();" 2>/dev/null || echo "0")
if [ "$HAB_COUNT" = "0" ]; then
  echo "Base de datos vacia, cargando datos iniciales..."
  php artisan db:seed --force --no-interaction
fi

echo "Iniciando Laravel en 0.0.0.0:8000"
exec php artisan serve --host=0.0.0.0 --port=8000