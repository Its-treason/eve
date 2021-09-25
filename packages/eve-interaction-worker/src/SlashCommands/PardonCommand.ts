import embedFactory from '../Factory/messageEmbedFactory';
import { CommandInteraction } from 'discord.js';
import { MessageActionRow, MessageButton } from 'discord.js';
import { EventStore } from '../eventStore/EventStore';
import { Aggregate } from '../eventStore/Aggregate';
import validateInput from '../Validation/validateInput';
import isNotDmChannel from '../Validation/Validators/isNotDmChannel';
import hasPermissions from '../Validation/Validators/hasPermissions';
import AbstractSlashCommand from './AbstractSlashCommand';

export default class PardonCommand extends AbstractSlashCommand {
  constructor(
    private eventStore: EventStore,
  ) {
    super({
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
    });
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const user = interaction.options.get('user').user;

    const inputValidationResult = await validateInput(
      interaction.guild,
      interaction,
      isNotDmChannel('This command cannot be used in a DMs!'),
      hasPermissions(interaction.user, 'BAN_MEMBERS', 'You dont have the permission to ban/unban member!'),
    );
    if (inputValidationResult === false) {
      return;
    }

    let banInfo;
    try {
      banInfo = await interaction.guild.bans.fetch({ user, force: true });
    } catch (e) {
      if (e.message !== 'Unknown Ban') {
        throw e;
      }

      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription(`${user} is currently not banned in this guild!`);
      await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true } });
      return;
    }

    const aggregate = Aggregate.createNew();
    const event = await aggregate.record(
      'pardon-interaction.create',
      { userId: interaction.user.id, targetUserId: user.id },
    );
    this.eventStore.saveAggregate(aggregate);

    const answer = embedFactory(interaction.client, 'Pardon');
    answer.setDescription(`Are u sure u want to revoke the ban of ${user}?`);
    answer.addField('Ban reason', banInfo.reason);

    const row = new MessageActionRow()
      .addComponents(new MessageButton()
          .setCustomId(`pardon-${event.getEventId().toString()}`)
          .setLabel('Revoke')
          .setStyle('DANGER'),
      );

    await interaction.reply({ embeds: [answer], components: [row], allowedMentions: { repliedUser: true } });

    setTimeout(() => {
      (async () => {
        const aggregate = await this.eventStore.loadAggregate(event.getEventId());

        if (await aggregate.getEventByTopic('pardon-interaction.executed') !== null) {
          return;
        }

        aggregate.record('pardon-interaction.timedOut', {});
        await this.eventStore.saveAggregate(aggregate);

        const row = new MessageActionRow()
          .addComponents(new MessageButton()
            .setCustomId('timedOut')
            .setLabel('Timed out')
            .setStyle('DANGER')
            .setDisabled(true),
          );

        await interaction.editReply({ components: [row] });
      })();
    }, 60000);
  }
}
