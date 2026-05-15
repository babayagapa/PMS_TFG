FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    autoconf g++ make git curl \
    libzip-dev zip unzip \
    openssl-dev oniguruma-dev \
    netcat-openbsd

RUN pecl install mongodb \
    && docker-php-ext-enable mongodb

RUN docker-php-ext-install zip pdo mbstring bcmath

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json ./
RUN composer install --no-dev --optimize-autoloader --no-scripts 2>/dev/null || true

COPY . .

RUN mkdir -p storage/logs \
    storage/framework/sessions \
    storage/framework/views \
    storage/framework/cache/data \
    bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chmod +x docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["sh", "docker-entrypoint.sh"]