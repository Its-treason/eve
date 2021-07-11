'use strict';

const logger = require('../util/logger');
const discord = require('discord.js');
const fs = require('fs');

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
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  client.commands.get(command).execute(message, args, client).catch(error => {
    logger.error('Error while executing command', {command, error});
  });
});

module.exports = client;
