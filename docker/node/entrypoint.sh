#!/bin/sh

case "$1" in
  bot) node ./dist/packages/bot/main.js ;;
  api) node ./dist/packages/api/main.js ;;
  react) cd packages/react && yarn run start ;;
esac
