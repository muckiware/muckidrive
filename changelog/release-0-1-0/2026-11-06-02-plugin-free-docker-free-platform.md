---
title: Plugin-free, Docker-free platform repository
author: tfreyda
---
- The platform repository no longer carries plugin trees - plugins (MuckiFacilityPlugin, MuckiLogPlugin) and the restic PHP client are cloned from their pinned GitHub tags at MuckiSafe image build time
- The Docker layer moved to [muckiware/MuckiSafe](https://github.com/muckiware/MuckiSafe) - muckidrive itself has no `docker/` directory
- `custom/muckiware/master` and `custom/muckiware/core` are committed as real files (no gitlinks) so the composer install context is complete
