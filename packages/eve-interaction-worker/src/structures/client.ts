import logger from '../util/logger';
import discord from 'discord.js';
import {readdirSync} from 'fs';
import {EveClient, EveEvent} from '../types';

console.log('evalutate client');

const intents = new discord.Intents();
intents.add('GUILDS');
intents.add('GUILD_MESSAGES');

const client: EveClient = new discord.Client({intents});

const eventFiles = readdirSync('./src/events');

eventFiles.forEach((eventFile) => {
  import(`../events/${eventFile}`).then((importedEvent: {default: EveEvent}) => {
    const event = importedEvent.default;

    client.on(event.name, event.execute);
  });
});

try {
  client.login(process.env.DISCORD_TOKEN).then(() => {
    logger.info('Discord Login Succeeded', {clientUsername: client.user?.username});
  });
} catch (error) {
  logger.critical('Discord Login Failed', {error, token: process.env.DISCORD_TOKEN?.substring(0,35)});
  process.exit(1);
}

export default client;
