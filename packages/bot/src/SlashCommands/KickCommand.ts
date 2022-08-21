import { ApplicationCommandData, ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits, User } from 'discord.js';
import SlashCommandInterface from './SlashCommandInterface';
import { injectable } from 'tsyringe';
import embedFactory from '../Factory/messageEmbedFactory';
import NotInDmChannelValidationHandler from '../Validation/Validators/NotInDmChannelValidationHandler';
import NotEqualsValidationHandler from '../Validation/Validators/NotEqualsValidationHandler';
import NotGuildOwnerValidationHandler from '../Validation/Validators/NotGuildOwnerValidationHandler';
import PermissionValidationHandler from '../Validation/Validators/PermissionValidationHandler';
import CommandValidator from '../Validation/CommandValidator';

@injectable()
export default class KickCommand implements SlashCommandInterface {
  constructor(
    private commandValidator: CommandValidator,
  ) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const actionUser = interaction.user;
    const targetUser = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason', false) || 'No reason given';

    this.commandValidator.validate(
      interaction,
      [
        new NotInDmChannelValidationHandler(),
        new PermissionValidationHandler(PermissionFlagsBits.KickMembers, actionUser),
        new NotEqualsValidationHandler(actionUser.id, targetUser.id, 'You cannot kick yourself'),
        new NotGuildOwnerValidationHandler(targetUser, 'Cannot kick the server owner'),
      ],
      () => this.doKick(interaction, actionUser, targetUser, reason),
    );
  }

  private async doKick(
    interaction: ChatInputCommandInteraction,
    actionUser: User,
    targetUser: User,
    reason: string,
  ): Promise<void> {
    await interaction.guild?.members.kick(
      targetUser,
      `"${reason}" by "${actionUser.username}#${actionUser.discriminator}" using EVE`,
    );

    const answer = embedFactory(interaction.client, 'Kicked');
    answer.setDescription(`${targetUser} was kicked from this server`);
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
