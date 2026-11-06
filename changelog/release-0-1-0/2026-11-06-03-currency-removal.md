---
title: Currency removed end-to-end
author: tfreyda
---
- The shop-domain concept "currency" is removed from the platform: backend services, admin filter items and installation parameters
- The container compiles with zero currency services, the DAL reindex runs green and `/admin` answers 200
