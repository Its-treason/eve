'use strict';

const logger = require('../util/logger');
const discord = require('discord.js');
const fs = require('fs');
const commandHandler = require('../commandHandler');

const intents = new discord.Intents();
intents.add('GUILDS');
intents.add('GUILD_MESSAGES');

const client = new discord.Client({intents});

client.commands = new discord.Collection();
const commandFiles = fs.readdirSync('./src/commands');

for (const file of commandFiles) {
  const command = require(`../commands/${file}`);

  client.commands.set(command.name, command);

  command.alias.forEach(commandAlias => client.commands.set(commandAlias, command));
}

client.on('messageCreate', message => {
  if (!message.content.startsWith(`<@!${client.user.id}>`) || message.author.bot) return;

  const args = message.content.slice(22).trim().split(/ +/);
  let commandString = args.shift().toLowerCase();

  if (!client.commands.has(commandString)) return;

  let command;
  try {
    command = client.commands.get(commandString);

    commandHandler(command, message, args, client).then(parsedArgs => {
      if (parsedArgs !== false) {
        command.execute(message, parsedArgs, client);
      }
    });
  } catch (error) {
    logger.error('Error while executing command', {command, error});
  }
});

module.exports = client;
