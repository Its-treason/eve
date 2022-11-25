import { ApplicationCommandData, ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits, PermissionResolvable, User } from 'discord.js';
import embedFactory from '../Factory/messageEmbedFactory';
import SlashCommandInterface from './SlashCommandInterface';
import { injectable } from 'tsyringe';
import CommandValidator from '../Validation/CommandValidator';
import NotEqualsValidationHandler from '../Validation/Validators/NotEqualsValidationHandler';
import NotGuildOwnerValidationHandler from '../Validation/Validators/NotGuildOwnerValidationHandler';
import NotInDmChannelValidationHandler from '../Validation/Validators/NotInDmChannelValidationHandler';
import PermissionValidationHandler from '../Validation/Validators/PermissionValidationHandler';
import UserNotBannedValidationHandler from '../Validation/Validators/UserNotBannedValidationHandler';
import { PublicLogCategories, PublicLogsRepository } from '@eve/core';

@injectable()
export default class BanCommand implements SlashCommandInterface {
  constructor(
    private commandValidator: CommandValidator,
    private publicLogger: PublicLogsRepository,
  ) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const targetUser = interaction.options.getUser('user', true);
    const actionUser = interaction.user;
    const reason = interaction.options.getString('reason', false) || 'No reason given';

    this.commandValidator.validate(
      interaction,
      [
        new NotInDmChannelValidationHandler(),
        new PermissionValidationHandler(PermissionFlagsBits.BanMembers, actionUser),
        new UserNotBannedValidationHandler(targetUser, 'This user is already banned'),
        new NotEqualsValidationHandler(actionUser.id, targetUser.id, 'You cannot ban yourself'),
        new NotGuildOwnerValidationHandler(targetUser, 'You cannot ban the server owner'),
      ],
      () => this.doBan(interaction, targetUser, actionUser, reason),
    );
  }

  private async doBan(
    interaction: ChatInputCommandInteraction,
    targetUser: User,
    actionUser: User,
    reason: string,
  ): Promise<void> {
    await interaction.guild?.members.ban(
      targetUser.id,
      { reason: `"${reason}" by "${actionUser.username}#${actionUser.discriminator}" using EVE` },
    );

    const answer = embedFactory(interaction.client, 'Banned');
    answer.setDescription(`${targetUser} was successfully banned!`);
    answer.addFields([{ name: 'Reason', value: reason }]);
    await interaction.reply({ embeds: [answer], allowedMentions: { repliedUser: true } });

    await this.publicLogger.createLog(
      `"${interaction.user.username}" used the "ban" command to ban "${targetUser.username}"`,
      PublicLogCategories.ModerationCommandUsed,
      [interaction.guild!.id],
      [interaction.user.id, targetUser.id],
    );
  }

  getData(): ApplicationCommandData {
    return {
      name: 'ban',
      description: 'Ban a user',
      type: ApplicationCommandType.ChatInput,
      options: [
        {
          name: 'user',
          description: 'User to Ban',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: 'reason',
          description: 'Ban reason',
          type: ApplicationCommandOptionType.String,
        },
      ],
      dmPermission: false,
      defaultMemberPermissions: PermissionFlagsBits.BanMembers.toString() as PermissionResolvable,
    };
  }
}
