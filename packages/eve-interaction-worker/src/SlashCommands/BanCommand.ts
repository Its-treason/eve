import { ApplicationCommandData, CommandInteraction } from 'discord.js';
import embedFactory from '../Factory/messageEmbedFactory';
import validateInput from '../Validation/validateInput';
import notEquals from '../Validation/Validators/notEquals';
import isNotGuildOwner from '../Validation/Validators/isNotGuildOwner';
import isNotDmChannel from '../Validation/Validators/isNotDmChannel';
import hasPermissions from '../Validation/Validators/hasPermissions';
import SlashCommandInterface from './SlashCommandInterface';
import { injectable } from 'tsyringe';

@injectable()
export default class BanCommand implements SlashCommandInterface {
  async execute(interaction: CommandInteraction): Promise<void> {
    const targetUser = interaction.options.get('user').user;
    const actionUser = interaction.user;
    const reason = interaction.options.get('reason')?.value as string || 'No reason given';

    const inputValidationResult = await validateInput(
      interaction.guild,
      interaction,
      notEquals(actionUser.id, targetUser.id, 'You cannot ban yourself!'),
      isNotGuildOwner(targetUser.id, 'The owner of this server cannot be banned!'),
      isNotDmChannel('This command cannot be used in a DMs!'),
      hasPermissions(interaction.user, 'BAN_MEMBERS', 'You dont have the permission to ban member!'),
    );
    if (inputValidationResult === false) {
      return;
    }

    let banInfo;
    try {
      banInfo = await interaction.guild.bans.fetch({ user: targetUser, force: true });
    } catch (e) {
      if (e.message !== 'Unknown Ban') {
        throw e;
      }
    }

    if (banInfo !== undefined) {
      const answer = embedFactory(interaction.client, 'Error');
      answer.setDescription(`${targetUser} is already banned in this guild!`);
      answer.addField('Ban reason', banInfo.reason);
      await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true } });
      return;
    }

    await interaction.guild.members.ban(
      targetUser.id,
      { reason: `"${reason}" by "${actionUser.username}#${actionUser.discriminator}" using EVE` },
    );

    const answer = embedFactory(interaction.client, 'Banned');
    answer.setDescription(`${targetUser} was successfully banned!`);
    answer.addField('Reason', reason);
    await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true } });
  }

  getData(): ApplicationCommandData {
    return {
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
    };
  }
}
