import embedFactory from '../Factory/messageEmbedFactory';
import { ApplicationCommandData, ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, PermissionFlagsBits, PermissionResolvable, User } from 'discord.js';
import SlashCommandInterface from './SlashCommandInterface';
import { injectable } from 'tsyringe';
import NotInDmChannelValidationHandler from '../Validation/Validators/NotInDmChannelValidationHandler';
import PermissionValidationHandler from '../Validation/Validators/PermissionValidationHandler';
import UserBannedValidationHandler from '../Validation/Validators/UserBannedValidationHandler';
import CommandValidator from '../Validation/CommandValidator';
import { PublicLogCategories, PublicLogsRepository } from '@eve/core';

@injectable()
export default class PardonCommand implements SlashCommandInterface {
  constructor(
    private commandValidator: CommandValidator,
    private publicLogger: PublicLogsRepository,
  ) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const targetUser = interaction.options.getUser('user', true);

    this.commandValidator.validate(
      interaction,
      [
        new NotInDmChannelValidationHandler(),
        new PermissionValidationHandler(PermissionFlagsBits.BanMembers),
        new UserBannedValidationHandler(targetUser, 'You don\'t have permission to pardon member'),
      ],
      () => this.doPardon(interaction, targetUser),
    );
  }

  private async doPardon(
    interaction: ChatInputCommandInteraction,
    targetUser: User
  ): Promise<void> {
    let banInfo = await interaction.guild?.bans.fetch({ user: targetUser });

    await interaction.guild?.bans.remove(targetUser);

    const answer = embedFactory(interaction.client, 'Pardoned');
    answer.setDescription(`${targetUser} was successfully pardoned!`);
    answer.addFields([{ name: 'Original ban reason', value: banInfo?.reason || 'N/A' }]);
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
      name: 'pardon',
      description: 'Revoke a ban',
      type: ApplicationCommandType.ChatInput,
      options: [
        {
          name: 'user',
          description: 'User to pardon',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
      dmPermission: false,
      defaultMemberPermissions: PermissionFlagsBits.BanMembers.toString() as PermissionResolvable,
    };
  }
}
