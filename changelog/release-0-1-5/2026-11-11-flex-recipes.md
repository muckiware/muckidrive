---
title: Updatable projects via muckidrive Flex recipes
author: tfreyda
---
- `composer create-project muckiware/muckidrive` installs a thin skeleton; Symfony Flex generates the project files (`public/index.php`, `bin/*`, `.htaccess` files, `config/bundles.php`, `.env`, `custom/*` placeholders) from the new [muckiware/recipes](https://github.com/muckiware/recipes) endpoint
- The muckiware recipes endpoint is the first entry in `extra.symfony.endpoint`, followed by `shopware/recipes` and `flex://defaults`; it overrides the `shopware/core` recipe, so Checkout and the Shopware Framework bundle are no longer registered by a recipe
- Generated files and `symfony.lock` are excluded from the dist package via `export-ignore`, so the recipes run on install and can be updated later with `composer recipes:update muckiware/core` / `muckiware/master`
- `muckiware/core` (`>=0.0.2 <0.2`) and `muckiware/master` (`>=0.0.1 <0.1`) are required with bounded version ranges instead of `*`
- New [UPGRADE.md](../../UPGRADE.md) describes the regular update and the one-time migration of projects created from v0.1.0 - v0.1.4
- The release workflow now smoke-tests the real dist archive (`git archive`) and asserts that the muckiware recipes were applied
- The repository `.gitignore` is no longer shipped (dev workspace only); new projects get theirs from the recipes and commit their `composer.lock`
- Security advisory `PKSA-s52d-n7sx-trsg` (`mcp/sdk`, required by `shopware/core`) is ignored via `config.audit.ignore`, so Composer >= 2.9 no longer blocks the install
- Removed the obsolete note about the standalone root `Installer/` directory - the web installer lives in `muckiware/core`
