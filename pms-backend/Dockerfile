FROM php:8.2-alpine
RUN apk add --no-cache autoconf g++ make git curl libzip-dev zip unzip \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && docker-php-ext-install zip
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY composer.json composer.lock* ./
RUN composer install --no-dev --optimize-autoloader 2>/dev/null || true
COPY . .
RUN chmod -R 775 storage bootstrap/cache 2>/dev/null || true
EXPOSE 8000