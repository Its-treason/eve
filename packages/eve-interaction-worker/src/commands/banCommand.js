'use strict';

const embedFactory = require('../util/embedFactory');
const getUserFromString = require('../util/getUserFromString');
const {User} = require('discord.js');
const {GuildMember} = require('discord.js');
const {MessageActionRow, MessageButton} = require('discord.js');

module.exports = {
  name: 'ban',
  alias: [],
  permissions: ['BAN_MEMBERS'],
  async execute(message, args, client) {
    let user = args[0];

    if (!(user instanceof GuildMember) && !(user instanceof User)) {
      const answer = embedFactory(client);
      answer.setTitle('Error');
      answer.setDescription('No user to Ban provided!');
      message.reply({embeds: [answer]});
      return;
    }

    if (user instanceof GuildMember) {
      user = user.user;
    }

    const answer = embedFactory(client);
    answer.setTitle('Ban');
    answer.setDescription(`Are u sure u want to Ban \`${user.username}\`?`);

    const row = new MessageActionRow()
      .addComponents(new MessageButton()
          .setCustomId(`ban-${user.id}`)
          .setLabel('Ban')
          .setStyle('DANGER'),
      );

    const banMessage = await message.reply({embeds: [answer], components: [row]});

    const filter = i => i.customId === `ban-${user.id}`;

    const collector = message.channel.createMessageComponentCollector({filter, time: 60000});

    collector.on('collect', async interaction => {
      if (interaction.user.id !== message.author.id) {
        answer.setTitle('Error');
        answer.setDescription('You did start this command!');
        await interaction.reply({ephemeral: true, embeds: [answer]});
        return;
      }

      const reason = args.slice(1).join(' ') || 'No reason given';
      await message.guild.members.ban(user.id, {reason: `"${reason}" by "${message.author.username}" using EVE`});

      const row = new MessageActionRow()
        .addComponents(new MessageButton()
          .setCustomId('banned')
          .setLabel('Banned')
          .setStyle('SUCCESS')
          .setDisabled(true),
        );

      await interaction.update({components: [row]});
    });

    collector.on('end', () => {
      //  Check if the Button was pressed and then disabled
      if (banMessage.components[0].components[0].disabled === false) {
        const row = new MessageActionRow()
          .addComponents(new MessageButton()
            .setCustomId(user.id)
            .setLabel('Timeout')
            .setStyle('DANGER')
            .setDisabled(true),
          );

        banMessage.edit({components: [row]});
      }
    });
  },
};
