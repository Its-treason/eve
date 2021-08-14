import embedFactory from '../util/embedFactory';
import {User} from 'discord.js';
import {GuildMember} from 'discord.js';
import {MessageActionRow, MessageButton} from 'discord.js';
import {EveCommand} from '../types';

const banCommand: EveCommand = {
  name: 'ban',
  alias: [],
  permissions: ['BAN_MEMBERS'],
  allowDms: false,
  async execute(message, args, client) {
    if (!(args[0] instanceof GuildMember) && !(args[0] instanceof User)) {
      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription('No or invalid user to Ban provided!');
      message.reply({embeds: [answer]});
      return;
    }

    if (args[0] instanceof GuildMember) {
      args[0] = args[0].user;
    }
    const user: User = args[0];

    const answer = embedFactory();
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

    const collector = banMessage.channel.createMessageComponentCollector({filter, message, time: 60000});

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

export default banCommand;
