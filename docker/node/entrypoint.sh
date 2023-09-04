#!/bin/sh

case "$1" in
  bot) node ./dist/packages/bot/index.js ;;
  api) node ./dist/packages/api/index.js ;;
  panel) npx nx run --skip-nx-cache panel:build:production && npx nx run panel:serve:production ;;
esac
