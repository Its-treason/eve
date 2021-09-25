import { ButtonInteraction, MessageActionRow, MessageButton } from 'discord.js';
import embedFactory from '../Factory/messageEmbedFactory';
import { EventStore } from '../eventStore/EventStore';
import { Id } from '../Value/Id';
import AbstractButtonInteraction from './AbstractInteraction';

export default class BanInteraction extends AbstractButtonInteraction {
  constructor(
    private eventStore: EventStore,
  ) {
    super('ban');
  }

  async execute(args: string[], buttonInteraction: ButtonInteraction): Promise<void> {
    const aggregate = await this.eventStore.loadAggregate(Id.fromString(args[0]));
    const event = aggregate.getEventByTopic('ban-interaction.create');

    const user = await buttonInteraction.client.users.fetch(`${BigInt(event.getPayload().userId)}`);
    const targetUser = await buttonInteraction.client.users.fetch(`${BigInt(event.getPayload().targetUserId)}`);
    const reason = event.getPayload().reason;

    if (buttonInteraction.user.id !== user.id) {
      const answer = embedFactory(buttonInteraction.client, 'Error');
      answer.setTitle('Error');
      answer.setDescription('You did not start this command!');
      await buttonInteraction.reply({ ephemeral: true, embeds: [answer] });
      return;
    }

    await buttonInteraction.guild.members.ban(
      targetUser.id,
      { reason: `"${reason}" by "${user.username}#${user.discriminator}" using EVE` },
    );

    const row = new MessageActionRow()
      .addComponents(new MessageButton()
        .setCustomId('banned')
        .setLabel('Banned')
        .setStyle('SUCCESS')
        .setDisabled(true),
      );

    await buttonInteraction.update({ components: [row] });

    aggregate.record('ban-interaction.executed', {});
    this.eventStore.saveAggregate(aggregate);
  }
}
