'use strict';

const embedFactory = require('./util/embedFactory');
const {User} = require('discord.js');

module.exports = async (command, message, args, client) => {
  const authorPerms = message.channel.permissionsFor(message.author);
  for (const permission of command.permissions) {
    if (!authorPerms || !await authorPerms.has(permission)) {
      const answer = embedFactory(client);
      answer.setTitle('Error');
      answer.setDescription('You dont have permissions to execute this Command!');
      message.reply({embeds: [answer]});
      return false;
    }
  }

  for (let i = 0; args.length > i; i++) {
    if (/<(@|@!|@&|#)([0-9]{17,19})>/.test(args[i])) {
      args[i] = await parseMention(args[i], message);
    } else if (/([0-9]{17,19})/.test(args[i])) {
      try {
        args[i] = await resolveUserId(args[i], message.guild);
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  }

  return args;
};

async function parseMention(arg, message) {
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

async function resolveUserId(id, guild) {
  const user = await guild.client.users.fetch(id);

  if (!(user instanceof User)) {
    throw new Error('User not Found!');
  }

  try {
    return await guild.members.fetch(user);
  } catch (e) {
    return user;
  }
}

async function resolveChannelId(id, guild) {
  const channel = await guild.channels.fetch(id);

  if (channel !== null) {
    return channel;
  }

  throw new Error('Channel not Found!');
}

async function resolveRoleId(id, guild) {
  const role = await guild.roles.fetch(id);

  if (role !== null) {
    return role;
  }

  throw new Error('Role not Found!');
}
