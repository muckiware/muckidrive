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

1. `mkdir changelog/release-<x-y-z>` and move all entries from `_unreleased/` into it
2. Commit, tag `v<x.y.z>` and push the tag
3. The [release workflow](../.github/workflows/release.yml) generates the notes from the folder, verifies the tag installs via `composer create-project`, publishes the GitHub release and triggers the MuckiSafe image build
