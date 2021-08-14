import embedFactory from '../util/embedFactory';
import {ButtonInteraction, GuildMember} from 'discord.js';
import {MessageActionRow, MessageButton} from 'discord.js';
import {EveCommand} from '../types';

const kickCommand: EveCommand = {
  name: 'kick',
  alias: [],
  permissions: ['KICK_MEMBERS'],
  allowDms: false,
  async execute(message, args, client) {
    const user = args[0];

    if (!(user instanceof GuildMember)) {
      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription('No or invalid user to kick provided!');
      message.reply({embeds: [answer]});
      return;
    }

    const answer = embedFactory();
    answer.setTitle('Kick');
    answer.setDescription(`Are u sure u want to kick \`${user.user.username}\`?`);

    const row = new MessageActionRow()
      .addComponents(new MessageButton()
          .setCustomId(`kick-${user.id}`)
          .setLabel('Kick')
          .setStyle('DANGER'),
      );

    const kickMessage = await message.reply({embeds: [answer], components: [row]});

    const filter = (i: ButtonInteraction): boolean => i.customId === `kick-${user.id}`;

    const collector = message.channel.createMessageComponentCollector({filter, time: 60000});

    collector.on('collect', async interaction => {
      if (interaction.user.id !== message.author.id) {
        answer.setTitle('Error');
        answer.setDescription('You did start this command!');
        await interaction.reply({ephemeral: true, embeds: [answer]});
        return;
      }

      const reason = args.slice(1).join(' ') || 'No reason given';
      await message.guild.members.kick(user.user, `"${reason}" by "${message.author.username}" using EVE`);

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

export default kickCommand;
