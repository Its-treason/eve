import {CommandInteraction, MessageActionRow, MessageButton} from 'discord.js';
import {EveSlashCommand} from '../types';
import embedFactory from '../Factory/messageEmbedFactory';
import {Aggregate} from '../eventStore/Aggregate';
import {EventStore} from '../eventStore/EventStore';
import validateInput from '../Validation/validateInput';
import notEquals from '../Validation/Validators/notEquals';
import isNotGuildOwner from '../Validation/Validators/isNotGuildOwner';
import isNotDmChannel from '../Validation/Validators/isNotDmChannel';
import hasPermissions from '../Validation/Validators/hasPermissions';

const banCommand: EveSlashCommand = {
  data: {
    name: 'ban',
    description: 'Ban a user',
    options: [
      {
        name: 'user',
        description: 'User to Ban',
        type: 6,
        required: true,
      },
      {
        name: 'reason',
        description: 'Ban reason',
        type: 3,
      },
    ],
  },
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.get('user').user;
    const reason = interaction.options.get('reason')?.value as string || 'No reason given';

    const inputValidationResult = await validateInput(
      interaction.guild,
      interaction,
      notEquals(interaction.user.id, user.id, 'You cannot ban yourself!'),
      isNotGuildOwner(user.id, 'The owner of this server cannot be banned!'),
      isNotDmChannel('This command cannot be used in a DMs!'),
      hasPermissions(interaction.user, 'BAN_MEMBERS', 'You dont have the permission to ban member!'),
    );
    if (inputValidationResult === false) {
      return;
    }

    let banInfo;
    try {
      banInfo = await interaction.guild.bans.fetch({user, force: true});
    } catch (e) {
      if (e.message !== 'Unknown Ban') {
        throw e;
      }
    }

    if (banInfo !== undefined) {
      const answer = embedFactory();
      answer.setTitle('Error');
      answer.setDescription(`${user} is already banned in this guild!`);
      answer.addField('Ban reason', banInfo.reason);
      await interaction.reply({embeds: [answer], allowedMentions: {repliedUser: true} });
      return;
    }

    const aggregate = Aggregate.createNew();
    const event = await aggregate.record(
      'ban-interaction.create',
      {userId: interaction.user.id, targetUserId: user.id, reason: reason},
    );

    const answer = embedFactory();
    answer.setTitle('Ban');
    answer.setDescription(`Are u sure u want to ban ${user}?`);

    const row = new MessageActionRow()
      .addComponents(new MessageButton()
          .setCustomId(`ban-${event.getEventId()}`)
          .setLabel('Ban')
          .setStyle('DANGER'),
      );

    await interaction.reply({embeds: [answer], components: [row], allowedMentions: {repliedUser: true} });

    setTimeout(() => {
      (async () => {
        const aggregate = await EventStore.loadAggregate(event.getEventId());

        if (await aggregate.getEventByTopic('ban-interaction.executed') !== null) {
          return;
        }

        await aggregate.record('ban-interaction.timedOut', {});

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

export default banCommand;
