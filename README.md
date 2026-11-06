# Muckidrive

Muckidrive is a foundation for building web services on top of the **Shopware 6.7 Core framework**. It is **not a webshop**. It uses Shopware as an application framework (DAL, DI, events, messaging, migrations, Admin API) and leaves out Checkout, Storefront and all commerce logic.

```
shopware/core ~v6.7.0   ← Base framework (DAL, DI, Events, Migrations)
muckiware/core          ← Selective loader: only the required Shopware Core bundles
muckiware/master        ← Customized administration (without shop UI)
custom/plugins/*        ← Your web services, built as regular Shopware plugins
```

## Requirements

| Tool | Version |
|---|---|
| PHP | 8.4 |
| MySQL | 8.4 |
| Composer | 2.x |
| Node.js / npm | for building the administration |
| [DDEV](https://ddev.com) | recommended local environment |

## Getting started

### Install via Composer

```bash
composer create-project muckiware/muckidrive my-project
```

> This works out of the box once `muckiware/muckidrive` is listed on Packagist.
> Until then, pass the GitHub repository explicitly:
>
> ```bash
> composer create-project muckiware/muckidrive my-project \
>   --repository='{"type":"vcs","url":"https://github.com/muckiware/muckidrive"}'
> ```

The created project is a ready platform checkout: dependencies installed, autoload dumped, `vendor/muckiware/*` symlinked to the vendored sources in `custom/muckiware/*`.

### Or clone the repository

```bash
git clone https://github.com/muckiware/muckidrive.git my-project
cd my-project
composer install
```

### First boot

1. Create the environment file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` - MySQL 8 database
   - `APP_SECRET` / `INSTANCE_ID` - generate with `openssl rand -hex 32` and `openssl rand -base64 24 | tr -d /+`
   - `MUCKIWARE_ROOT` - absolute project path (`/var/www/html` inside DDEV)

2. Install the database and the basic system setup:

   ```bash
   bin/console system:install --create-database \
     --shop-name "My project" --shop-email "admin@example.com" --shop-locale "en-GB" \
     --skip-assets-install --skip-first-run-wizard --no-assign-theme
   ```

3. Create an admin user:

   ```bash
   bin/console user:create --admin --password <password> --email admin@example.com \
     --firstName Admin --lastName User admin
   ```

4. Build the administration UI:

   ```bash
   bin/build-administration.sh
   ```

In DDEV, prefix the console with `ddev exec` (`ddev exec bin/console ...`) so PHP 8.4 from the container is used.

## Architecture

### Active bundles

The bundles are configured in [`config/bundles.php`](config/bundles.php). `Shopware\Core\Checkout\Checkout` and the Storefront are **deliberately disabled**.

| Bundle | Purpose |
|---|---|
| `Muckiware\Core\Framework\Framework` | Framework services: API, Cache, Filesystem, Plugin, Script, Webhook |
| `Muckiware\Core\System\System` | System services: Country, CustomEntity, Locale, User, Integration, Tag |
| `Muckiware\Core\Content\Content` | Content services: Cookie, Media, CMS, MailTemplate, Flow |
| `Muckiware\Master\Administration` | Administration UI without shop modules |
| `Shopware\Core\Maintenance\Maintenance` | Shopware maintenance commands |
| `Shopware\Core\Profiling\Profiling` | Profiling |
| `Shopware\Core\Service\Service` | Shopware service layer |

### muckiware/core

Namespace `Muckiware\Core\`. Each sub-bundle loads only the Shopware Core service definitions it needs, straight from `vendor/shopware/core`, not the whole Shopware stack. `Helper::getFolderByClassName()` finds the Shopware Core path at runtime.

### muckiware/master

Namespace `Muckiware\Master\`. This is a customized version of the Shopware administration:

- **Backend:** controllers for the admin UI, search, tags, user config, notifications and system info
- **Frontend:** Vue 3 + Twig.js, Vite (`pentatrion/vite-bundle`), Pinia, Vue Router, TypeScript, Jest

## Development

### Build the administration

```bash
bin/build-administration.sh   # production build
bin/watch-administration.sh   # watch mode
bin/build-js.sh               # all JS assets
```

Inside `custom/muckiware/master/Resources/app/administration/`:

```bash
npm run build    # production build
npm run watch    # development watch
npm run unit     # Jest unit tests
npm run eslint   # linting
```

### Console

Run PHP commands inside the DDEV container so that PHP 8.4 is used:

```bash
ddev exec bin/console cache:clear
ddev exec bin/console plugin:refresh
```

### Writing plugins

Web services live in `custom/plugins/` as standard Shopware plugins (they extend `Shopware\Core\Framework\Plugin`):

```bash
ddev exec bin/console plugin:refresh
ddev exec bin/console plugin:install --activate YourPluginName
```

> Plugins that depend on Checkout, Storefront, products, customers or sales channels **will not run** on Muckidrive, because those parts of Shopware are not loaded.

**Example:** [`MuckiLogPlugin`](https://github.com/muckiware/MuckiLogPlugin) (separate repository) is a Log4php-based logging plugin with a custom entity, a migration, a scheduled task and an exception subscriber.

### Conventions

- `declare(strict_types=1);`, PSR-12, `final` by default
- Namespace prefix `Muckiware\` for core components
- Services are defined in XML (`services.xml`)
- To extend Shopware Core services, use decorators (`XyzDecorator` decorates `Xyz`)
- Code, comments, commits and docs are written in English

## Releases & changelog

- Every user-visible change gets an entry in [`changelog/_unreleased/`](changelog/README.md) - one small markdown file per change.
- For a release the entries move to `changelog/release-<x-y-z>/` and a Git tag `v<x.y.z>` is pushed.
- The [release workflow](.github/workflows/release.yml) then verifies that the tag installs via `composer create-project`, generates the release notes from the changelog folder, publishes the GitHub release and triggers the MuckiSafe image build.

The ready-to-run Docker distribution (MuckiSafe, `ghcr.io/muckiware/muckisafe`) lives in [muckiware/MuckiSafe](https://github.com/muckiware/MuckiSafe).

## License

[MIT](LICENSE) © muckiware
