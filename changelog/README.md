# Changelog

muckidrive keeps a Shopware-style changelog: **one small markdown file per user-visible change**, living in `changelog/_unreleased/` until the next release moves it into `changelog/release-<x-y-z>/` (dashes instead of dots).

## Adding an entry

Create one file per change, named `YYYY-MM-DD-short-slug.md`:

```markdown
---
title: Short human title
author: tfreyda
---
- One bullet per user-visible aspect
```

There is no single big `CHANGELOG.md` - the folders are the changelog, and the release notes are generated from them.

## Release procedure

1. Develop on `main` with one entry per change in `_unreleased/`
2. Merge `main` into the `release` branch (a fast-forward merge keeps the post-release sync simple) and push - the [release workflow](../.github/workflows/release.yml) does the rest automatically:
   - verifies the tree installs via `composer create-project`
   - computes the next version: patch bump of the latest `v*` tag (override via *Run workflow* on the `release` branch with the `version` input)
   - moves all entries from `_unreleased/` into `changelog/release-<x-y-z>/`, commits the move with `[skip ci]` and fast-forwards `main`
   - tags, publishes the GitHub release with the generated notes and triggers the MuckiSafe image build

If a release run fails halfway, retry with *Run workflow* and the intended version - the workflow skips the tag and the changelog move if they already exist.

> Note: the workflow pushes to `release` and `main`, so the `release` branch must stay unprotected (or allow pushes from GitHub Actions).
