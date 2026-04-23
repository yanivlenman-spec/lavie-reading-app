---
description: Build and deploy the Lavie reading app to Vercel (lavie-reading-app.vercel.app)
allowed-tools: Bash(bash deploy.sh*), Bash(npx tsc*)
---

First run a type check, then deploy:

```bash
npx tsc --noEmit && bash deploy.sh
```

This exports the Expo web build and deploys + aliases to lavie-reading-app.vercel.app.
