'use strict';

const embedFactory = require('../util/embedFactory');
const getUserFromString = require('../util/getUserFromString');
const {MessageActionRow, MessageButton} = require('discord.js');

module.exports = {
  name: 'kick',
  alias: [],
  permissions: ['BAN_MEMBERS'],
  async execute(message, args, client) {
    const authorPerms = message.channel.permissionsFor(message.author);
    if (!authorPerms || !await authorPerms.has('KICK_MEMBERS')) {
      const answer = embedFactory(client);
      answer.setTitle('Error');
      answer.setDescription('You dont have permissions to execute this Command!');
      message.reply({embeds: [answer]});
      return;
    }

    if (args[0] === undefined) {
      const answer = embedFactory(client);
      answer.setTitle('Error');
      answer.setDescription('No user to kick provided!');
      message.reply({embeds: [answer]});
      return;
    }

    const user = await getUserFromString(args[0], client);

    if (user === null) {
      await sendUserNotFoundError(args[0], user, client, message);
      return;
    }

    const answer = embedFactory(client);
    answer.setTitle('Kick');
    answer.setDescription(`Are u sure u want to kick \`${user.username}\`?`);

    const row = new MessageActionRow()
      .addComponents(new MessageButton()
          .setCustomId(`kick-${user.id}`)
          .setLabel('Kick')
          .setStyle('DANGER'),
      );

    const kickMessage = await message.reply({embeds: [answer], components: [row]});

    const filter = i => i.customId === `kick-${user.id}`;

    const collector = message.channel.createMessageComponentCollector({filter, time: 60000});

    collector.on('collect', async interaction => {
      if (interaction.user.id !== message.author.id) {
        answer.setTitle('Error');
        answer.setDescription('You did start this command!');
        await interaction.reply({ephemeral: true, embeds: [answer]});
        return;
      }

      const reason = args.slice(1).join(' ') || 'No reason given';
      await message.guild.members.kick(user, `"${reason}" by "${message.author.username}" using EVE`);

      const row = new MessageActionRow()
        .addComponents(new MessageButton()
          .setCustomId('kicked')
          .setLabel('Kicked')
          .setStyle('SUCCESS')
          .setDisabled(true),
        );

      await interaction.update({components: [row]});
    });

    collector.on('end', () => {
      //  Check if the Button was pressed and then disabled
      if (kickMessage.components[0].components[0].disabled === false) {
        const row = new MessageActionRow()
          .addComponents(new MessageButton()
            .setCustomId(user.id)
            .setLabel('Timeout')
            .setStyle('DANGER')
            .setDisabled(true),
          );

        kickMessage.edit({components: [row]});
      }
    });
  },
};

async function sendUserNotFoundError(arg, user, client, message) {
  const answer = embedFactory(client);
  answer.setTitle('Error');
  answer.setDescription(`"${arg}" could be resolved into an UserId`);
  message.reply({embeds: [answer]});
}
