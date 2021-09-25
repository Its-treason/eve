import { ButtonInteraction, MessageActionRow, MessageButton } from 'discord.js';
import { EventStore } from '../eventStore/EventStore';
import { Id } from '../Value/Id';
import embedFactory from '../Factory/messageEmbedFactory';
import AbstractButtonInteraction from './AbstractInteraction';

export default class PardonInteraction extends AbstractButtonInteraction {
  constructor(
    private eventStore: EventStore,
  ) {
    super('pardon');
  }

  async execute(args: string[], buttonInteraction: ButtonInteraction): Promise<void> {
    const aggregate = await this.eventStore.loadAggregate(Id.fromString(args[0]));
    const event = aggregate.getEventByTopic('pardon-interaction.create');

    const user = await buttonInteraction.client.users.fetch(`${BigInt(event.getPayload().userId)}`);
    const targetUser = await buttonInteraction.client.users.fetch(`${BigInt(event.getPayload().targetUserId)}`);

    if (buttonInteraction.user.id !== user.id) {
      const answer = embedFactory(buttonInteraction.client, 'Error');
      answer.setDescription('You did start this command!');
      await buttonInteraction.reply({ ephemeral: true, embeds: [answer] });
      return;
    }

    await buttonInteraction.guild.bans.remove(targetUser);

    const row = new MessageActionRow()
      .addComponents(new MessageButton()
        .setCustomId('revoked')
        .setLabel('Revoked')
        .setStyle('SUCCESS')
        .setDisabled(true),
      );

    await buttonInteraction.update({ components: [row] });

    await aggregate.record('pardon-interaction.executed', {});
    this.eventStore.saveAggregate(aggregate);
  }
}
