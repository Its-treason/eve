'use strict';

const logger = require('./src/util/logger');
const discordClientConfig = require('./src/config/discordClientConfig');

let client;

// Make the App exit clean when killed by pm2
process.on('SIGINT', () => {
  logger.notice('Got SIGINT exiting');
  client?.destroy();
  process.exit(0);
});

async function start() {
  client = discordClientConfig;

  try {
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    logger.critical('Discord Login Failed', {error, token: process.env.DISCORD_TOKEN.substring(0,35)});
    process.exit(1);
  }

  logger.info('Discord Login Succeeded', {clientUsername: client.user.username});
  process.send('ready');
}

start();
