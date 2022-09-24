#!/bin/sh

case "$1" in
  bot) node ./dist/packages/bot/main.js ;;
  api) node ./dist/packages/api/main.js ;;
  panel) cd ./dist/packages/panel && npx next start ;;
esac
