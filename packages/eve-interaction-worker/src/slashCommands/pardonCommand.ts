import embedFactory from '../util/embedFactory';
import {CommandInteraction} from 'discord.js';
import {MessageActionRow, MessageButton} from 'discord.js';
import {EveSlashCommand} from '../types';
import {EventStore} from '../eventStore/EventStore';
import {Aggregate} from '../eventStore/Aggregate';

const pardonCommand: EveSlashCommand = {
  data: {
    name: 'pardon',
    description: 'Revoke a users ban',
    options: [
      {
        name: 'user',
        description: 'User to unban',
        type: 6,
        required: true,
      },
    ],
  },
  permissions: ['BAN_MEMBERS'],
  allowDms: false,
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.get('user').user;

    let banInfo;
    try {
      banInfo = await interaction.guild.bans.fetch({user, force: true});
    } catch (e) {
      if (e.message !== 'Unknown Ban') {
        throw e;
      }

      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription(`${user} is currently not banned in this guild!`);
      await interaction.reply({embeds: [answer], allowedMentions: {repliedUser: true} });
      return;
    }

    const aggregate = Aggregate.createNew();
    const event = await aggregate.record(
      'pardon-interaction.create',
      {userId: interaction.user.id, targetUserId: user.id},
    );

    const answer = embedFactory();
    answer.setTitle('Pardon');
    answer.setDescription(`Are u sure u want to revoke the ban of ${user}?`);
    answer.addField('Ban reason', banInfo.reason);

    const row = new MessageActionRow()
      .addComponents(new MessageButton()
          .setCustomId(`pardon-${event.getEventId().toString()}`)
          .setLabel('Revoke')
          .setStyle('DANGER'),
      );

    await interaction.reply({embeds: [answer], components: [row], allowedMentions: {repliedUser: true} });

    setTimeout(() => {
      (async () => {
        const aggregate = await EventStore.loadAggregate(event.getEventId());

        if (await aggregate.getEventByTopic('pardon-interaction.executed') !== null) {
          return;
        }

        await aggregate.record('pardon-interaction.timedOut', {});

        const row = new MessageActionRow()
          .addComponents(new MessageButton()
            .setCustomId('timedOut')
            .setLabel('Timed out')
            .setStyle('DANGER')
            .setDisabled(true),
          );

        await interaction.editReply({components: [row]});
      })();
    }, 60000);
  },
};

export default pardonCommand;
