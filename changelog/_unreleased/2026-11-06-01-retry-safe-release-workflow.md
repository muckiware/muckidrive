---
title: Retry-safe release workflow with readable dispatch errors
author: tfreyda
---
- Retrying a release via workflow dispatch with the same version no longer fails on the existing tag or GitHub release - both steps are skipped when they already exist
- The MuckiSafe dispatch step reports the HTTP status and the GitHub error body instead of failing with a bare exit code, so rejected dispatch tokens are immediately diagnosable
