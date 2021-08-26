import {EveInteraction} from '../types';
import {ButtonInteraction, MessageActionRow, MessageButton} from 'discord.js';
import {EventStore} from '../eventStore/EventStore';
import {Id} from '../Value/Id';
import embedFactory from '../Factory/messageEmbedFactory';

const interaction: EveInteraction = {
  name: 'pardon',
  execute: async (args, buttonInteraction) => {
    if (!(buttonInteraction instanceof ButtonInteraction)) {
      return;
    }

    const aggregate = await EventStore.loadAggregate(Id.fromString(args[0]));
    const event = aggregate.getEventByTopic('pardon-interaction.create');

    const user = await buttonInteraction.client.users.fetch(`${BigInt(event.getPayload().userId)}`);
    const targetUser = await buttonInteraction.client.users.fetch(`${BigInt(event.getPayload().targetUserId)}`);

    if (buttonInteraction.user.id !== user.id) {
      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription('You did start this command!');
      await buttonInteraction.reply({ephemeral: true, embeds: [answer]});
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

    await buttonInteraction.update({components: [row]});

    await aggregate.record('pardon-interaction.executed', {});
  },
};

export default interaction;
