import logger from '../util/logger';
import discord from 'discord.js';
import {readdirSync} from 'fs';
import {EveClient, EveEvent, EveSlashCommand} from '../types';
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';

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

const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN);

(async () => {
  const slashCommandFiles = readdirSync('./src/slashCommands');
  const slashCommands = [];

  for (let i = 0; i < slashCommandFiles.length; i++) {
    const slashCommandFile = slashCommandFiles[i];

    const importedSlashCommand: {default: EveSlashCommand} = await import(`../slashCommands/${slashCommandFile}`);

    const slashCommand = importedSlashCommand.default;

    slashCommands.push(slashCommand.data);
  }

  try {
    await rest.put(
      Routes.applicationGuildCommands('605426789396774912', '558316518602178561'),
      {body: slashCommands},
    );
  } catch (error) {
    console.error(error);
  }
})();

try {
  client.login(process.env.DISCORD_TOKEN).then(() => {
    logger.info('Discord Login Succeeded', {clientUsername: client.user?.username});
  });
} catch (error) {
  logger.critical('Discord Login Failed', {error, token: process.env.DISCORD_TOKEN?.substring(0,35)});
  process.exit(1);
}

export default client;
