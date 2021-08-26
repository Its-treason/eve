import logger from '../util/logger';
import discord from 'discord.js';
import {EveClient} from '../types';
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
// Import all EventFiles
import interactionCreate from '../events/interactionCreate';
// Import all SlashCommands
import banCommand from '../slashCommands/banCommand';
import kickCommand from '../slashCommands/kickCommand';
import pardonCommand from '../slashCommands/pardonCommand';
import whoisCommand from '../slashCommands/whoisCommand';
import bonkCommand from '../slashCommands/bonkCommand';
import avatarCommand from '../slashCommands/avatarCommand';
import inviteCommand from '../slashCommands/inviteCommand';

const intents = new discord.Intents();
intents.add('GUILDS');
intents.add('GUILD_MESSAGES');

const client: EveClient = new discord.Client({intents});

client.on(interactionCreate.name, interactionCreate.execute);

// Register Slash Commands
const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN);
(async () => {
  const slashCommands = [];
  slashCommands.push(banCommand.data);
  slashCommands.push(kickCommand.data);
  slashCommands.push(pardonCommand.data);
  slashCommands.push(whoisCommand.data);
  slashCommands.push(bonkCommand.data);
  slashCommands.push(avatarCommand.data);
  slashCommands.push(inviteCommand.data);

  try {
    if (process.env.NODE_ENV === 'development') {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        {body: slashCommands},
      );
      return;
    }

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
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
