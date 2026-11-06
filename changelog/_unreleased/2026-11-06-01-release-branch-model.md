---
title: Release versions are cut from the release branch
author: tfreyda
---
- A new release version is created only when `main` is merged (or pushed) into the `release` branch - pushing a Git tag alone no longer triggers a release
- The release workflow computes the next version automatically (patch bump of the latest tag; an explicit version can be given via workflow dispatch) and creates the tag itself
- Unreleased changelog entries are moved into `changelog/release-<x-y-z>/` by the workflow and the move is synced back to `main`
