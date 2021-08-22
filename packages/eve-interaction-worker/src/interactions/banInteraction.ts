import {EveInteraction} from '../types';
import {ButtonInteraction, MessageActionRow, MessageButton} from 'discord.js';
import embedFactory from '../util/embedFactory';
import {EventStore} from '../eventStore/EventStore';
import {Id} from '../Value/Id';

const interaction: EveInteraction = {
  name: 'ban',
  execute: async (args, buttonInteraction) => {
    if (!(buttonInteraction instanceof ButtonInteraction)) {
      return;
    }

    const aggregate = await EventStore.loadAggregate(Id.fromString(args[0]));
    const event = aggregate.getEventByTopic('ban-interaction.create');

    const user = await buttonInteraction.client.users.fetch(`${BigInt(event.getPayload().userId)}`);
    const targetUser = await buttonInteraction.client.users.fetch(`${BigInt(event.getPayload().targetUserId)}`);
    const reason = event.getPayload().reason;

    if (buttonInteraction.user.id !== user.id) {
      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription('You did not start this command!');
      await buttonInteraction.reply({ephemeral: true, embeds: [answer]});
      return;
    }

    await buttonInteraction.guild.members.ban(
      targetUser.id,
      {reason: `"${reason}" by "${user.username}#${user.discriminator}" using EVE`},
    );

    const row = new MessageActionRow()
      .addComponents(new MessageButton()
        .setCustomId('banned')
        .setLabel('Banned')
        .setStyle('SUCCESS')
        .setDisabled(true),
      );

    await buttonInteraction.update({components: [row]});

    await aggregate.record('ban-interaction.executed', {});
  },
};

export default interaction;
