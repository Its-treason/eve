import formatSeconds from '../util/formatSeconds';
import embedFactory from '../util/embedFactory';
import {Message, User} from 'discord.js';
import {GuildMember} from 'discord.js';
import {EveClient, EveCommand, ParsedArg} from '../types';

const whoisCommand: EveCommand = {
  name: 'whois',
  alias: [],
  permissions: [],
  allowDms: true,
  async execute(message: Message, args: ParsedArg[], client: EveClient) {
    const user = message.author;

    if (args[0] === undefined) {
      await sendWhoIs(user, client, message);
      return;
    }

    for (const arg of args) {
      if (arg instanceof GuildMember) {
        await sendWhoIs(arg.user, client, message);
        continue;
      }

      if (arg instanceof User) {
        await sendWhoIs(arg, client, message);
        continue;
      }

      await sendWhoIsError(arg, message);
    }
  },
};

async function sendWhoIs(user, client, message) {
  const answer = embedFactory();
  answer.setAuthor(user.username, user.avatarURL());
  answer.addField('ID:', user.id);
  answer.addField('Account Created:', user.createdAt.toUTCString());
  answer.addField('Account Age:', formatSeconds(Math.floor((Date.now() - user.createdTimestamp) / 1000)));
  getAttributes(user, answer, message);
  await message.reply({embeds: [answer]});
}

function getAttributes(user, answer, message) {
  const attributes = [];

  if (user.bot === true) {
    attributes.push('- Bot Account');
  }
  if (user.system === true) {
    attributes.push('- Offical Discord System User');
  }
  if (user.id === message.guild.ownerID) {
    attributes.push('- Owner of this Server');
  }

  if (attributes.length === 0) {
    return;
  }

  answer.addField('Attributes:', '```yml\n' + attributes.join('\n') + '```');
}

export default whoisCommand;

function sendWhoIsError(arg: ParsedArg, message: Message) {
  const answer = embedFactory();
  answer.setTitle('Error');
  answer.setDescription(`\`${arg}\` could be resolved into an UserId`);
  message.reply({embeds: [answer]});
}
