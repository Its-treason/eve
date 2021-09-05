import logger from '../Util/Logger';
import {Intents, Client} from 'discord.js';
import {EveClient} from '../types';
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import interactionCreate from '../events/interactionCreate';
import slashCommandArrayFactory from '../Factory/slashCommandArrayFactory';

const intents = new Intents();
intents.add('GUILDS');
intents.add('GUILD_MESSAGES');
intents.add('GUILD_VOICE_STATES');
intents.add('GUILD_BANS');

const client: EveClient = new Client({intents});

client.on(interactionCreate.name, interactionCreate.execute);

const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN);
(async () => {
  const slashCommandsData = slashCommandArrayFactory().map((slashCommand) => slashCommand.data);

  try {
    if (process.env.NODE_ENV === 'development') {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        {body: slashCommandsData},
      );
      return;
    }

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      {body: slashCommandsData},
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
