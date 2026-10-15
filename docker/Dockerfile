# syntax=docker/dockerfile:1
#
# MuckiSafe image — muckidrive (Shopware 6.7 core framework, no shop context)
# with the Muckiware facility and logging plugins added at build time.
#
# muckidrive is a general platform: plugins do NOT live in its repository.
# The MuckiSafe image adds them when it is built:
#   - MuckiFacilityPlugin (github.com/muckiware/MuckiFacilityPlugin, tag below)
#   - MuckiLogPlugin     (github.com/muckiware/MuckiLogPlugin, tag below)
# The restic PHP client library (muckiware/restic, no Packagist) is cloned at
# build time as well — the custom/muckiware/* path repo in composer.json
# picks it up.

# ---------------------------------------------------------------------------
# Stage 1: dependencies + administration build (discarded afterwards)
# ---------------------------------------------------------------------------
FROM php:8.4-fpm-bookworm AS build

RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip curl jq ca-certificates \
        libzip-dev libicu-dev libpng-dev libjpeg-dev libfreetype6-dev libsodium-dev \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_mysql mysqli intl gd zip sodium opcache bcmath

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Node.js 22 for the administration build (Vue 3 + Vite)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Application skeleton (ordered for layer caching)
COPY composer.json composer.lock symfony.lock ./
COPY bin ./bin
COPY config ./config
COPY files ./files
COPY public ./public
COPY src ./src
COPY .htaccess ./
COPY custom/muckiware ./custom/muckiware

# --- MuckiSafe additions: plugins cloned from their public GitHub tags -----
# muckidrive is a general platform — plugins do NOT live in its repository.
# The image adds MuckiFacilityPlugin and MuckiLogPlugin at build time.
# The restic PHP client library is a facility-plugin dependency that is not
# on Packagist — it is cloned as well and picked up by the existing
# custom/muckiware/* path repository in composer.json.
ARG FACILITY_PLUGIN_REF=v0.7.0
ARG LOG_PLUGIN_REF=v2.4.0
ARG RESTIC_LIB_REF=v1.5.0
RUN git clone --depth 1 --branch ${FACILITY_PLUGIN_REF} https://github.com/muckiware/MuckiFacilityPlugin.git custom/plugins/MuckiFacilityPlugin \
 && git clone --depth 1 --branch ${LOG_PLUGIN_REF} https://github.com/muckiware/MuckiLogPlugin.git custom/plugins/MuckiLogPlugin \
 && git clone --depth 1 --branch ${RESTIC_LIB_REF} https://github.com/muckiware/restic.git custom/muckiware/restic \
 && rm -rf custom/plugins/MuckiFacilityPlugin/.git custom/plugins/MuckiLogPlugin/.git custom/muckiware/restic/.git

# muckidrive does not load the Shopware storefront bundle. The MuckiLogPlugin
# storefront ErrorControllerDecorator (shipped in v2.4.0) decorates a service
# that does not exist here and would break container compilation — the service
# block is removed during the build (verified against SW 6.7.15.1).
RUN sed -i '/<service id="MuckiLogPlugin\\Storefront\\Controller\\ErrorControllerDecorator"/,/<\/service>/d' \
        custom/plugins/MuckiLogPlugin/src/Resources/config/services.xml \
 && ! grep -q ErrorControllerDecorator custom/plugins/MuckiLogPlugin/src/Resources/config/services.xml \
 && php -r 'exit(simplexml_load_file("custom/plugins/MuckiLogPlugin/src/Resources/config/services.xml") === false ? 1 : 0);' \
 && echo "MuckiLogPlugin services.xml patched and valid"

# Register both plugins with composer (path repos custom/plugins/*, same as DDEV)
RUN composer require \
        muckiware/facility-plugin:"*" \
        muckiware/log-plugin:"*" \
        --no-interaction --no-scripts \
 && composer dump-autoload --optimize \
 && composer install --no-dev --optimize-autoloader --no-interaction

# Administration production build (no database required — verified:
# bundle:dump, feature:dump, framework:schema and assets:install all run
# without a DB connection)
ENV APP_ENV=prod \
    MUCKIWARE_ROOT=/var/www/html \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    DISABLE_ADMIN_COMPILATION_TYPECHECK=true \
    NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_UPDATE_NOTIFIER=false

RUN bash bin/build-administration.sh

# ---------------------------------------------------------------------------
# Stage 2: runtime (Apache + PHP, no Node.js, no build toolchain)
# ---------------------------------------------------------------------------
FROM php:8.4-apache-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
        curl ca-certificates restic netcat-openbsd \
        libzip-dev libicu-dev libpng-dev libjpeg-dev libfreetype6-dev libsodium-dev \
    && rm -rf /var/lib/apt/lists/* \
    && a2enmod rewrite headers

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_mysql mysqli intl gd zip sodium opcache bcmath

WORKDIR /var/www/html

COPY --from=build /var/www/html /var/www/html
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh \
    && sed -i 's|/var/www/html|/var/www/html/public|' /etc/apache2/sites-available/000-default.conf \
    && printf '<Directory /var/www/html/public>\n    AllowOverride All\n    Require all granted\n</Directory>\n' \
       > /etc/apache2/conf-available/docroot.conf \
    && a2enconf docroot \
    && mkdir -p /var/www/html/var \
    && chown -R www-data:www-data /var/www/html

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["apache2-foreground"]