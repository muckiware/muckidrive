---
title: Initial platform release
author: tfreyda
---
- Shopware `~6.7.0` Core used as an application framework (DAL, DI, events, messaging, migrations, Admin API) - Checkout, Storefront and commerce bundles are deliberately not loaded
- `muckiware/core`: selective loader that registers only the required Shopware Core services (Framework, System, Content)
- `muckiware/master`: customized administration (Vue 3 + Vite, without shop modules)
- Development environment via DDEV (PHP 8.4), committed composer lock file, PHPStan and PHPUnit scaffolding
