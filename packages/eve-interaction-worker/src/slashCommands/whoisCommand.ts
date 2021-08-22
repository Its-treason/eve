import formatSeconds from '../util/formatSeconds';
import embedFactory from '../util/embedFactory';
import {CommandInteraction, MessageEmbed, User} from 'discord.js';
import {EveSlashCommand} from '../types';

const whoisCommand: EveSlashCommand = {
  data: {
    name: 'whois',
    description: 'Get info about user',
    options: [
      {
        name: 'user',
        description: 'User to lookup',
        type: 6,
      },
    ],
  },
  async execute(interaction: CommandInteraction) {
    const user = interaction.user;

    if (interaction.options.has('user') === false) {
      await sendWhoIs(user, interaction);
      return;
    }

    await sendWhoIs(interaction.options.get('user').user, interaction);
  },
};

async function sendWhoIs(user: User, interaction: CommandInteraction) {
  const answer = embedFactory();
  answer.setAuthor(user.username, user.avatarURL());
  answer.addField('ID:', user.id);
  answer.addField('Account Created:', user.createdAt.toUTCString());
  answer.addField('Account Age:', formatSeconds(Math.floor((Date.now() - user.createdTimestamp) / 1000)));
  getAttributes(user, answer, interaction);
  await interaction.reply({embeds: [answer]});
}

function getAttributes(user: User, answer: MessageEmbed, interaction: CommandInteraction) {
  const attributes = [];

  if (user.bot === true) {
    attributes.push('- Bot Account');
  }
  if (user.system === true) {
    attributes.push('- Offical Discord System User');
  }
  if (user.id === interaction.guild.ownerId) {
    attributes.push('- Owner of this Server');
  }

  if (attributes.length === 0) {
    return;
  }

  answer.addField('Attributes:', '```yml\n' + attributes.join('\n') + '```');
}

export default whoisCommand;
