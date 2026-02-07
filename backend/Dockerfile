FROM php:8.0-apache

WORKDIR /var/www/html

ENV TZ="America/Sao_Paulo"

RUN buildDeps=" \
        default-libmysqlclient-dev \
        libbz2-dev \
        libmemcached-dev \
        libsasl2-dev \
    " \
    runtimeDeps=" \
        curl \
        git \
        libfreetype6-dev \
        libicu-dev \
        libjpeg-dev \
        libmemcachedutil2 \
        libzip-dev \
        libpng-dev \
        libxml2-dev \
    " \
    && apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y $buildDeps $runtimeDeps \
    && docker-php-ext-install gd iconv mysqli pdo pdo_mysql xml zip \
    && docker-php-ext-configure gd --with-freetype=/usr/include/ --with-jpeg=/usr/include/ \
    && pecl install memcached \
    && docker-php-ext-enable memcached.so \
    && apt-get purge -y --auto-remove $buildDeps \
    && rm -r /var/lib/apt/lists/* \
    && a2enmod rewrite \
    && a2enmod headers \
    && a2enmod deflate \
    && a2enmod ssl

# restart apache with servername
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN service apache2 restart

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer --version
