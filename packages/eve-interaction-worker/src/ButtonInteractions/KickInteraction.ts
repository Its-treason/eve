import { ButtonInteraction, MessageActionRow, MessageButton } from 'discord.js';
import { EventStore } from '../eventStore/EventStore';
import { Id } from '../Value/Id';
import embedFactory from '../Factory/messageEmbedFactory';
import AbstractButtonInteraction from './AbstractInteraction';

export default class KickInteraction extends AbstractButtonInteraction {
  constructor(
    private eventStore: EventStore,
  ) {
    super('kick');
  }

  async execute(args: string[], buttonInteraction: ButtonInteraction): Promise<void> {
    const aggregate = await this.eventStore.loadAggregate(Id.fromString(args[0]));
    const event = aggregate.getEventByTopic('kick-interaction.create');

    const user = await buttonInteraction.client.users.fetch(`${BigInt(event.getPayload().userId)}`);
    const targetUser = await buttonInteraction.client.users.fetch(`${BigInt(event.getPayload().targetUserId)}`);
    const reason = event.getPayload().reason;

    if (buttonInteraction.user.id !== user.id) {
      const answer = embedFactory(buttonInteraction.client, 'Error');
      answer.setDescription('You did start this command!');
      await buttonInteraction.reply({ ephemeral: true, embeds: [answer] });
      return;
    }

    await buttonInteraction.guild.members.kick(
      targetUser,
      `"${reason}" by "${user.username}#${user.discriminator}" using EVE`,
    );

    const row = new MessageActionRow()
      .addComponents(new MessageButton()
        .setCustomId('kicked')
        .setLabel('Kicked')
        .setStyle('SUCCESS')
        .setDisabled(true),
      );

    await buttonInteraction.update({ components: [row] });

    await aggregate.record('kick-interaction.executed', {});
    this.eventStore.saveAggregate(aggregate);
  }
}
