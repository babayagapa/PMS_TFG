FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    autoconf \
    g++ \
    make \
    openssl-dev \
    pkgconfig \
    libzip-dev \
    oniguruma-dev \
    libxml2-dev \
    curl

# Install PHP extensions
RUN pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl bcmath xml

# Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP dependencies (skip scripts during Docker build)
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true

EXPOSE 9000

CMD ["php-fpm"]
