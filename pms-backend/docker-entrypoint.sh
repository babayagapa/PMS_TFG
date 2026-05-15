#!/bin/sh
set -e

echo "--- Esperando a MongoDB ---"
i=0
while [ $i -lt 30 ]; do
  if nc -z mongo 27017 2>/dev/null; then
    echo "MongoDB listo."
    break
  fi
  echo "Intento $i de 30, reintentando en 2s..."
  i=$((i+1))
  sleep 2
done

cd /var/www/html

# Instalar dependencias si vendor no existe
# (ocurre siempre porque el volumen de docker-compose
#  monta la carpeta local encima del contenedor y vendor/
#  esta en .gitignore, por lo que no existe en local)
if [ ! -f "vendor/autoload.php" ]; then
  echo "Instalando dependencias de Composer..."
  composer install --no-interaction --optimize-autoloader
fi

# Generar APP_KEY si no esta definida
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
  echo "Generando APP_KEY..."
  php artisan key:generate --force --no-interaction
fi

# Generar JWT_SECRET si no esta definida
if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "" ]; then
  echo "Generando JWT_SECRET..."
  php artisan jwt:secret --force --no-interaction
fi

# Limpiar cache
php artisan config:clear --no-interaction 2>/dev/null || true
php artisan cache:clear  --no-interaction 2>/dev/null || true

# Seed inicial
echo "Ejecutando seeders..."
php artisan db:seed --force --no-interaction 2>/dev/null || echo "Seed omitido."

echo "--- Iniciando Laravel en 0.0.0.0:8000 ---"
exec php artisan serve --host=0.0.0.0 --port=8000