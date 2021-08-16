import {Collection, Message} from 'discord.js';
import {EveCommand, EveEvent} from '../types';
import logger from '../util/logger';
import commandHandler from '../commandHandler';
import {readdirSync} from 'fs';

const commands = new Collection();

const commandFiles = readdirSync('./src/commands');
commandFiles.forEach((commandFile) => {
  import(`../commands/${commandFile}`).then((importedCommand: {default: EveCommand}) => {
    const command = importedCommand.default;

    commands.set(command.name, command);
  });
});

const messageCreate: EveEvent = {
  name: 'messageCreate',
  execute: async (message: Message) => {
    const client = message.client;

    if (!message.content.startsWith(`<@!${client.user.id}>`) || message.author.bot) return;

    const args = message.content.slice(22).trim().split(/ +/);
    const commandString = args.shift().toLowerCase();

    if (!commands.has(commandString)) return;

    let command;
    try {
      command = commands.get(commandString);

      commandHandler(command, message, args, client).then(parsedArgs => {
        if (parsedArgs !== false) {
            command.execute(message, parsedArgs, client);
          }
        });
    } catch (error) {
      logger.error('Error while executing command', {commandName: command.name, error});
    }
  },
};

export default messageCreate;
