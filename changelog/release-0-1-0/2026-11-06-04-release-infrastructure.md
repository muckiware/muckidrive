---
title: Release infrastructure
author: tfreyda
---
- Composer package identity: `name` (`muckiware/muckidrive`), `description`, `license: MIT` (matches the LICENSE file) - enables `composer create-project muckiware/muckidrive` once the package is resolvable (Packagist, or the documented `--repository` fallback)
- Changelog process: per-change entries in `changelog/_unreleased/`, moved to `changelog/release-<x-y-z>/` at release time; release notes are generated from that folder
- CI: composer validate + install, PHPStan, a gitlink guard and a full administration build on every push/PR
- Release workflow: tag `v*` triggers a `composer create-project` dist verification, publishes the GitHub release and triggers the MuckiSafe image build (repository_dispatch)
- Distribution hygiene: `.gitattributes` export-ignore for repo-only files, `.env.example` for first boot, `SECURITY.md`, installation docs in the README
