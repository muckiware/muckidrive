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

**Example:** [`MuckiLogPlugin`](custom/plugins/MuckiLogPlugin) is a Log4php-based logging plugin with a custom entity, a migration, a scheduled task and an exception subscriber.

### Conventions

- `declare(strict_types=1);`, PSR-12, `final` by default
- Namespace prefix `Muckiware\` for core components
- Services are defined in XML (`services.xml`)
- To extend Shopware Core services, use decorators (`XyzDecorator` decorates `Xyz`)
- Code, comments, commits and docs are written in English

## License

[MIT](LICENSE) © muckiware
