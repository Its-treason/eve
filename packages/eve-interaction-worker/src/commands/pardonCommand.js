'use strict';

const embedFactory = require('../util/embedFactory');
const getUserFromString = require('../util/getUserFromString');
const {MessageActionRow, MessageButton} = require('discord.js');

module.exports = {
  name: 'pardon',
  alias: [],
  permissions: ['BAN_MEMBERS'],
  async execute(message, args, client) {
    const authorPerms = message.channel.permissionsFor(message.author);
    if (!authorPerms || !await authorPerms.has('BAN_MEMBERS')) {
      const answer = embedFactory(client);
      answer.setTitle('Error');
      answer.setDescription('You dont have permissions to execute this Command!');
      message.reply({embeds: [answer]});
      return;
    }

    if (args[0] === undefined) {
      const answer = embedFactory(client);
      answer.setTitle('Error');
      answer.setDescription('No user to pardon provided!');
      message.reply({embeds: [answer]});
      return;
    }

    const user = await getUserFromString(args[0], client);

    if (user === null) {
      await sendUserNotFoundError(args[0], user, client, message);
      return;
    }

    let banInfo;
    try {
      // This will throw error when user is not Banned
      banInfo = await message.guild.bans.fetch({user, force: true});
    } catch (e) {
      if (e.message !== 'Unknown Ban') {
        throw e;
      }

      const answer = embedFactory(client);
      answer.setTitle('Error');
      answer.setDescription(`"${user.username}" is currently not Banned on this Guild!`);
      message.reply({embeds: [answer]});
    }

    const answer = embedFactory(client);
    answer.setTitle('Ban');
    answer.setDescription(`Are u sure u want to revoke the Ban of \`${user.username}\`?`);
    answer.addField('Ban reason', banInfo.reason);

    const row = new MessageActionRow()
      .addComponents(new MessageButton()
          .setCustomId(`pardon-${user.id}`)
          .setLabel('Revoke')
          .setStyle('DANGER'),
      );

    const pardonMessage = await message.reply({embeds: [answer], components: [row]});

    const filter = i => i.customId === `pardon-${user.id}`;

    const collector = message.channel.createMessageComponentCollector({filter, time: 60000});

    collector.on('collect', async interaction => {
      if (interaction.user.id !== message.author.id) {
        answer.setTitle('Error');
        answer.setDescription('You did start this command!');
        await interaction.reply({ephemeral: true, embeds: [answer]});
        return;
      }

      await message.guild.bans.remove(user);

      const row = new MessageActionRow()
        .addComponents(new MessageButton()
          .setCustomId('revoked')
          .setLabel('Revoked')
          .setStyle('SUCCESS')
          .setDisabled(true),
        );

      await interaction.update({components: [row]});
    });

    collector.on('end', () => {
      //  Check if the Button was pressed and then disabled
      if (pardonMessage.components[0].components[0].disabled === false) {
        const row = new MessageActionRow()
          .addComponents(new MessageButton()
            .setCustomId(user.id)
            .setLabel('Timeout')
            .setStyle('DANGER')
            .setDisabled(true),
          );

        pardonMessage.edit({components: [row]});
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
