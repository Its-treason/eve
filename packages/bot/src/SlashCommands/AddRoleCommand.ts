import embedFactory from '../Factory/messageEmbedFactory';
import {
  APIRole, ApplicationCommandData, ApplicationCommandOptionType, ApplicationCommandType, BaseMessageOptions, ChatInputCommandInteraction, Guild, PermissionFlagsBits, PermissionResolvable, Role,
} from 'discord.js';
import SlashCommandInterface from './SlashCommandInterface';
import { injectable } from 'tsyringe';
import NotInDmChannelValidationHandler from '../Validation/Validators/NotInDmChannelValidationHandler';
import CommandValidator from '../Validation/CommandValidator';
import BotPermissionValidationHandler from '../Validation/Validators/BotPermissionValidationHandler';
import BotCanManageRoleValidationHandler from '../Validation/Validators/BotCanManageRoleValidationHandler';
import { Logger, PublicLogCategories, PublicLogger } from '@eve/core';
import PermissionValidationHandler from '../Validation/Validators/PermissionValidationHandler';

type AddRoleResult = {
  succeeded: number,
  unchanged: number,
  failed: number,
}

@injectable()
export default class AddRoleCommand implements SlashCommandInterface {
  constructor(
    private commandValidator: CommandValidator,
    private logger: Logger,
    private publicLogger: PublicLogger,
  ) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const targetRole = interaction.options.getRole('role', true);
    const includeBots = interaction.options.getBoolean('include_bots') || false;

    this.commandValidator.validate(
      interaction,
      [
        new NotInDmChannelValidationHandler(),
        new PermissionValidationHandler(PermissionFlagsBits.ManageRoles, interaction.user),
        new BotPermissionValidationHandler(PermissionFlagsBits.ManageRoles),
        new BotCanManageRoleValidationHandler(targetRole),
      ],
      () => this.addRoles(interaction, targetRole, includeBots),
    );
  }

  private async addRoles(
    interaction: ChatInputCommandInteraction,
    role: APIRole|Role,
    includeBots: boolean,
  ): Promise<void> {
    const guild = interaction.guild!;
    let results: AddRoleResult = { succeeded: 0, failed: 0, unchanged: 0 };

    await interaction.reply(this.createMessage(role, results, interaction));

    for await (results of this.addRole(role, guild, results, includeBots)) {
      await interaction.editReply(this.createMessage(role, results, interaction));
    }

    await interaction.editReply(this.createMessage(role, results, interaction));

    await this.publicLogger.createLog(
      `"${interaction.user.username}" used the "add_role" command to add the role "${role.name}" to all member of "${guild.name}"`,
      PublicLogCategories.ModerationCommandUsed,
      [guild.id],
      [interaction.user.id],
    );
  }

  private async *addRole(role: APIRole|Role, guild: Guild, results: AddRoleResult, includeBots: boolean): AsyncGenerator<AddRoleResult> {
    let lastId: undefined|string;

    while (true) {
      const members = await guild.members.list({ limit: 20, after: lastId });
      if (members.size === 0) {
        break;
      }
      lastId = members.last()?.id;

      for (const [, member] of members) {
        try {
          if (member.roles.cache.has(role.id) || (member.user.bot === true && !includeBots)) {
            results.unchanged++;
            continue;
          }

          await member.roles.add(role.id);
          results.succeeded++;
        } catch (error) {
          results.failed++;

          this.logger.warning('Error while adding role', {
            error,
            roleId: role.id,
            roleName: role.name,
            userId: member.id,
            userName: member.displayName,
          });
        }
      }

      yield results;
    }
  }

  private createMessage(
    role: APIRole|Role,
    results: AddRoleResult,
    interaction: ChatInputCommandInteraction,
  ): BaseMessageOptions {
    const responseEmbed = embedFactory(interaction.client, 'Adding roles');
    responseEmbed.setDescription(
      `Adding the role ${role} to all server member

      Progress: **Finished**

      Succeeded: **${results.succeeded}**
      Unchanged: **${results.unchanged}**
      Failed: **${results.failed}**`,
    );
    return { embeds: [responseEmbed] };
  }

  getData(): ApplicationCommandData {
    return {
      name: 'add_role',
      description: 'Add a role to all server members',
      type: ApplicationCommandType.ChatInput,
      options: [
        {
          name: 'role',
          description: 'The Role to add to all user',
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
        {
          name: 'include_bots',
          description: 'Also add roles to Bots',
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],
      dmPermission: false,
      defaultMemberPermissions: PermissionFlagsBits.ManageRoles.toString() as PermissionResolvable,
    };
  }
}
