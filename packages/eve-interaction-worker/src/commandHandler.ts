import embedFactory from './util/embedFactory';
import {Channel, DMChannel, Guild, GuildMember, Message, Role, User} from 'discord.js';
import {EveClient, EveCommand, ParsedArg} from './types';

export default async (command: EveCommand, message: Message, args: string[], client: EveClient): Promise<ParsedArg[]|false> => {
  if (message.channel instanceof DMChannel) {
    if (command.allowDms === false) {
      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription('You can\'t use this command in DM\'s!');
      message.reply({embeds: [answer]});
      return false;
    }
  } else {
    const authorPerms = message.channel.permissionsFor(message.author);
    for (const permission of command.permissions) {
      if (!authorPerms || !authorPerms.has(permission)) {
        const answer = embedFactory();
        answer.setTitle('Error');
        answer.setDescription('You don\'t have permissions to execute this command!');
        message.reply({embeds: [answer]});
        return false;
      }
    }
  }

  const parsedArgs: ParsedArg[] = [];
  for (let i = 0; args.length > i; i++) {
    parsedArgs[i] = args[i];
    if (/<(@|@!|@&|#)([0-9]{17,19})>/.test(args[i])) {
      parsedArgs[i] = await parseMention(args[i], message);
    } else if (/([0-9]{17,19})/.test(args[i])) {
      try {
        parsedArgs[i] = await resolveUserId(args[i], message.guild);
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  }

  return parsedArgs;
};

async function parseMention(arg: string, message: Message): Promise<ParsedArg> {
  const slicedArg = arg.slice(1, -1);

  try {
    switch (true) {
      case slicedArg.startsWith('@&'):
        return await resolveRoleId(slicedArg.slice(2), message.guild);
      case slicedArg.startsWith('@!'):
        return await resolveUserId(slicedArg.slice(2), message.guild);
      case slicedArg.startsWith('@'):
        return await resolveUserId(slicedArg.slice(1), message.guild);
      case slicedArg.startsWith('#'):
        return await resolveChannelId(slicedArg.slice(1), message.guild);
      default:
        return arg;
    }
  } catch (e) {
    return arg;
  }
}

async function resolveUserId(id: string, guild: Guild): Promise<never|GuildMember|User> {
  const user = await guild.client.users.fetch(`${BigInt(id)}`);

  if (!(user instanceof User)) {
    throw new Error('User not Found!');
  }

  try {
    return await guild.members.fetch(user);
  } catch (e) {
    return user;
  }
}

async function resolveChannelId(id: string, guild: Guild): Promise<Channel|never> {
  const channel = await guild.channels.fetch(`${BigInt(id)}`);

  if (channel !== null) {
    return channel;
  }

  throw new Error('Channel not Found!');
}

async function resolveRoleId(id: string, guild: Guild): Promise<(Role|never)> {
  const role = await guild.roles.fetch(`${BigInt(id)}`);

  if (role !== null) {
    return role;
  }

  throw new Error('Role not Found!');
}
