#!/usr/bin/env bash
set -e
npx expo export --platform web
DEPLOY_URL=$(npx vercel deploy dist --yes --prod 2>&1 | grep "^Production:" | awk '{print $2}')
echo "Deployed to: $DEPLOY_URL"
npx vercel alias "$DEPLOY_URL" lavie-reading-app.vercel.app
echo "Live at https://lavie-reading-app.vercel.app"
