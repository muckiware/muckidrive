# Muckidrive — CLAUDE.md

## Project Overview

**Muckidrive** is a Shopware 6.7-based platform serving as a general foundation for web services — **not a webshop**. Shopware Core is used as an application framework without Checkout, Storefront, or commerce logic. The project enables development of arbitrary web services built on top of the Shopware Core Framework (DAL, DI, Events, Messaging, APIs).

```
shopware/core ~v6.7.0   ← Base framework (DAL, DI, Events, Migrations)
muckiware/core          ← Selective loader: only required SW Core bundles
muckiware/master        ← Customized administration (without shop UI)
custom/plugins/*        ← Your plugins (added by each deployment, not part of the platform)
```

## Architecture

### Bundle Structure (`config/bundles.php`)

Active bundles — deliberately **no** `Shopware\Core\Checkout\Checkout`:

| Bundle | Purpose |
|---|---|
| `Muckiware\Core\Framework\Framework` | Selective SW Core loader (framework services) |
| `Muckiware\Core\System\System` | Selective SW Core loader (system services) |
| `Muckiware\Core\Content\Content` | Selective SW Core loader (content services) |
| `Muckiware\Master\Administration` | Customized admin UI (without shop elements) |
| `Shopware\Core\Maintenance\Maintenance` | Shopware maintenance tools |
| `Shopware\Core\Profiling\Profiling` | Profiling |
| `Shopware\Core\Service\Service` | Shopware service layer |

Checkout and Storefront are **intentionally disabled** (commented out in `bundles.php`).

### muckiware/core (`custom/muckiware/core`)

Namespace: `Muckiware\Core\`

Selective loader for Shopware Core services — loads only what is needed, not the entire Shopware stack. Each sub-bundle has its own `build()` method that selectively loads SW Core XML service definitions:

- **Framework**: API, Cache, Filesystem, Plugin, Script, Webhook — **no** Storefront, **no** SEO
- **System**: Country, CustomEntity, Locale, User, Integration, Tag — no SalesChannel context
- **Content**: Cookie, Media, CMS, MailTemplate, Flow — **no** Product, Category, Customer

`Helper::getFolderByClassName()` — resolves the SW Core path via reflection at runtime so that XML service definitions can be loaded from the vendor directory.

### muckiware/master (`custom/muckiware/master`)

Namespace: `Muckiware\Master\`

Customized administration based on Shopware Administration, without shop-specific modules. Registered as `Administration extends Bundle`.

**Backend controllers:**
- `AdministrationController` — main entry point for admin UI, snippets, locales, known IPs
- `AdminSearchController` — global admin search via DAL
- `AdminTagController` — tag management
- `UserConfigController` — user settings
- `NotificationController` — admin notifications
- `SystemInfoController` — system info API

**Frontend stack:**
- Vue 3 + Twig.js (no SFCs, dynamic component factory)
- Vite as build tool (`pentatrion/vite-bundle`)
- Pinia (state management), Vue Router, Axios
- TypeScript for new code, Jest for tests

**Services:**
- `SnippetFinder` / `CachedSnippetFinder` — i18n snippets with cache decorator
- `AdminSearcher` — DAL-based search
- `ViteFileAccessorDecorator` — Vite asset handling in Shopware
- `AdministrationRouteScope` — route scope for admin requests
- `AdministrationReadinessCheck` — health check

**Migrations:**
- `V6_4/Migration1636121186CopySalesChannelIdsIntoUserConfig`
- `V6_4/Migration1660813696AddAppAdministrationSnippet`
- `V6_7/Migration1737472122TokenUser`
- `V6_7/Migration1744203319MailTemplate`
- `V6_7/Migration1757057005MailTemplate`

## Development Environment

| Tool | Version / Detail |
|---|---|
| DDEV | Project name: `muckidirve` |
| PHP | 8.4 |
| MySQL | 8.4 |
| Webserver | Apache-FPM |
| Admin URL | `https://muckidirve.ddev.site/admin` |

```bash
ddev start
ddev composer install
```

## Build

```bash
# Build administration
bin/build-administration.sh

# Build all JS assets
bin/build-js.sh

# Watch mode for development
bin/watch-administration.sh
```

The administration build runs inside `custom/muckiware/master/Resources/app/administration/`:

```bash
cd custom/muckiware/master/Resources/app/administration
npm run build      # Production build
npm run watch      # Development watch
npm run unit       # Jest unit tests
npm run eslint     # Linting
```

## Plugin Development

Plugins live in `custom/plugins/` and are standard Shopware plugins (extend `Plugin`).

**Example plugin:** [`MuckiLogPlugin`](https://github.com/muckiware/MuckiLogPlugin) (separate repository)
- Log4php-based logging system
- Custom entity, migration, scheduled task
- Event subscriber for exceptions

Important: plugins that require Shopware Checkout elements **cannot** run on Muckidrive, since `Shopware\Core\Checkout\Checkout` is disabled.

## PHP Standards

In addition to the global standards in `~/.claude/CLAUDE.md`:

- Namespace prefix: `Muckiware\` for all core components
- Bundle classes extend `Shopware\Core\Framework\Bundle` (not `Plugin`)
- Services are defined via XML (`services.xml`), no PHP attributes for production services
- Prefer decorators for SW Core extensions (pattern: `XyzDecorator decorates XyzOriginal`)

## Known Issues / Notes

- `masterTRY/` inside `custom/muckiware/` is an experimental work-in-progress branch — **not production**
- Decorators in `master/Core/` (Cart, Cache, SalesChannelProxy) are commented out — intentionally inactive shop elements
- `NotificationDefinition` is already marked deprecated (`@deprecated tag:v6.8.0`)
- `Installer/` at the project root contains a standalone installer kernel — separate installation without a running shop
- `Muckiware\Master\Administration` imports `AppPayloadServiceHelper` from `muckiware/core` — direct dependency between the two bundles

## Language

All code, comments, commit messages, and documentation in this project must be written in **English**.

## Next Steps

- `/shopware-concept` — create a feature concept for new web service functionality
- `/shopware-implement` — implementation based on this project
- `/shopware-plugin create PluginName` — scaffold a new plugin
- `/shopware-review` — code review before merge