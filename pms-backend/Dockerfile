FROM php:8.2-fpm-alpine

# Instalar dependencias del sistema necesarias para MongoDB y Laravel
RUN apk add --no-cache \
    autoconf g++ make git curl \
    libzip-dev zip unzip \
    openssl-dev \
    oniguruma-dev

# Instalar la extension de MongoDB para PHP
RUN pecl install mongodb \
    && docker-php-ext-enable mongodb

# Instalar otras extensiones de PHP que necesita Laravel
RUN docker-php-ext-install zip pdo mbstring bcmath

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar composer.json primero para aprovechar la cache de Docker
COPY composer.json ./
RUN composer install --no-dev --optimize-autoloader --no-scripts 2>/dev/null || true

# Copiar el resto del proyecto
COPY . .

# Permisos de Laravel
RUN mkdir -p storage/logs storage/framework/sessions \
    storage/framework/views storage/framework/cache \
    bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8000
