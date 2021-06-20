'use strict';

const formatSeconds = require('../util/formatSeconds');
const embedFactory = require('../util/embedFactory');
const getUserFromMention = require('../util/getUserFromMention');

module.exports = {
  name: 'whois',
  alias: [],
  async execute(message, args, client) {
    let user = message.author;

    if (args[0] === undefined) {
      await sendWhoIs(user, client, message);
      return;
    }

    for (const arg of args) {
      try {
        user = getUserFromMention(arg, client);

        if (user === null) {
          user = await client.users.fetch(arg);
        }
      } catch (e) {
        await sendWhoIsError(arg, user, client, message);
        continue;
      }

      await sendWhoIs(user, client, message);
    }
  },
};

async function sendWhoIs(user, client, message) {
  const answer = embedFactory(client);
  answer.setAuthor(user.username, user.avatarURL());
  answer.addField('ID:', user.id);
  answer.addField('Account Created:', user.createdAt.toUTCString());
  answer.addField('Account Age:', formatSeconds(Math.floor((Date.now() - user.createdTimestamp) / 1000)));
  getAttributes(user, answer, message);
  await message.channel.send(answer);
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

async function sendWhoIsError(arg, user, client, message) {
  const answer = embedFactory(client);
  answer.setTitle('Error');
  answer.setDescription(`\`${arg}\` could be resolved into an UserId`);
  message.reply(answer);
}
