import embedFactory from '../util/embedFactory';
import {GuildMember, User} from 'discord.js';
import {MessageActionRow, MessageButton} from 'discord.js';
import {EveCommand} from '../types';

const pardonCommand: EveCommand = {
  name: 'pardon',
  alias: [],
  permissions: ['BAN_MEMBERS'],
  allowDms: false,
  async execute(message, args, client) {
    if (!(args[0] instanceof GuildMember) && !(args[0] instanceof User)) {
      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription('No user or invalid to Ban provided!');
      message.reply({embeds: [answer]});
      return;
    }

    if (args[0] instanceof GuildMember) {
      args[0] = args[0].user;
    }
    const user = args[0];

    let banInfo;
    try {
      banInfo = await message.guild.bans.fetch({user, force: true});
    } catch (e) {
      if (e.message !== 'Unknown Ban') {
        throw e;
      }

      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription(`"${user.username}" is currently not Banned on this Guild!`);
      message.reply({embeds: [answer]});
      return;
    }

    const answer = embedFactory();
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

export default pardonCommand;
