import { ApplicationCommandData, ApplicationCommandOptionType, ApplicationCommandType, CommandInteraction } from 'discord.js';
import validateInput from '../Validation/validateInput';
import notEquals from '../Validation/Validators/notEquals';
import isNotGuildOwner from '../Validation/Validators/isNotGuildOwner';
import isNotDmChannel from '../Validation/Validators/isNotDmChannel';
import hasPermissions from '../Validation/Validators/hasPermissions';
import SlashCommandInterface from './SlashCommandInterface';
import { injectable } from 'tsyringe';
import embedFactory from '../Factory/messageEmbedFactory';

@injectable()
export default class KickCommand implements SlashCommandInterface {
  async execute(interaction: CommandInteraction): Promise<void> {
    const actionUser = interaction.user;
    const targetUser = interaction.options.get('user').user;
    const reason = String(interaction.options.get('reason')?.value) || 'No reason given';

    const inputValidationResult = await validateInput(
      interaction.guild,
      interaction,
      notEquals(actionUser.id, targetUser.id, 'You cannot kick yourself!'),
      isNotGuildOwner(targetUser.id, 'The owner of this server cannot be kicked!'),
      isNotDmChannel('This command cannot be used in a DMs!'),
      hasPermissions(interaction.user, 'KICK_MEMBERS', 'You dont have the permission to kick member!'),
    );
    if (inputValidationResult === false) {
      return;
    }

    await interaction.guild.members.kick(
      targetUser,
      `"${reason}" by "${actionUser.username}#${actionUser.discriminator}" using EVE`,
    );

    const answer = embedFactory(interaction.client, 'Kicked');
    answer.setDescription(`${targetUser} was successfully kicked!`);
    answer.addFields([{ name: 'Reason', value: reason }]);
    await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true } });
  }

  getData(): ApplicationCommandData {
    return {
      name: 'kick',
      description: 'Kick a user',
      type: ApplicationCommandType.ChatInput,
      options: [
        {
          name: 'user',
          description: 'User to kick',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: 'reason',
          description: 'Kick reason',
          type: ApplicationCommandOptionType.String,
        },
      ],
    };
  }
}
