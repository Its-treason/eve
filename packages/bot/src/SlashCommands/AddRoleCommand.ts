import embedFactory from '../Factory/messageEmbedFactory';
import { APIRole, ApplicationCommandData, ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, Guild, PermissionFlagsBits, Role } from 'discord.js';
import SlashCommandInterface from './SlashCommandInterface';
import { injectable } from 'tsyringe';
import NotInDmChannelValidationHandler from '../Validation/Validators/NotInDmChannelValidationHandler';
import CommandValidator from '../Validation/CommandValidator';
import BotPermissionValidationHandler from '../Validation/Validators/BotPermissionValidationHandler';
import BotCanManageRoleValidationHandler from '../Validation/Validators/BotCanManageRoleValidationHandler';
import { Logger } from '@eve/core';
import PermissionValidationHandler from '../Validation/Validators/PermissionValidationHandler';

type AddRoleResult = {
  succeeded: number,
  failed: number,
}

@injectable()
export default class AddRoleCommand implements SlashCommandInterface {
  constructor(
    private commandValidator: CommandValidator,
    private logger: Logger,
  ) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const targetRole = interaction.options.getRole('role', true);

    this.commandValidator.validate(
      interaction,
      [
        new NotInDmChannelValidationHandler(),
        new PermissionValidationHandler(PermissionFlagsBits.ManageRoles, interaction.user),
        new BotPermissionValidationHandler(PermissionFlagsBits.ManageRoles),
        new BotCanManageRoleValidationHandler(targetRole),
      ],
      () => this.addRoles(interaction, targetRole),
    );
  }

  private async addRoles(interaction: ChatInputCommandInteraction, role: APIRole|Role): Promise<void> {
    const guild = interaction.guild!;

    const responseEmbed = embedFactory(interaction.client, 'Adding roles');
    responseEmbed.setDescription(
      `Adding the role ${role} to all server member
      
      Progress: ${0} / ${guild.memberCount}`,
    );
    interaction.reply({ embeds: [responseEmbed] });

    let results: AddRoleResult = { succeeded: 0, failed: 0 };
    for await (results of this.addRole(role, guild)) {
      responseEmbed.setDescription(
        `Adding the role ${role} to all server member
        
        Progress: **${results.succeeded + results.failed}** of **${guild.memberCount}**

        Succeeded: **${results.succeeded}**
        Failed: **${results.failed}**
        `,
      );
      interaction.editReply({ embeds: [responseEmbed] });
    }

    responseEmbed.setDescription(
      `Adding the role ${role} to all server member

      Progress: **Finished**

      Succeeded: **${results.succeeded}**
      Failed: **${results.failed}**
      `,
    );
    interaction.editReply({ embeds: [responseEmbed] });
  }

  private async *addRole(role: APIRole|Role, guild: Guild): AsyncGenerator<AddRoleResult> {
    let lastId: undefined|string
    const results: AddRoleResult = { succeeded: 0, failed: 0 };

    while (true) {
      const members = await guild.members.list({ limit: 50, after: lastId });
      if (members.size === 0) {
        break;
      }

      for (const [_, member] of members) {
        try {
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
          })
        }

        lastId = members.last()?.id;
      }

      yield results;
    }
  }

  getData(): ApplicationCommandData {
    return {
      name: 'add_role',
      description: 'Add a role to all members of the server',
      type: ApplicationCommandType.ChatInput,
      options: [
        {
          name: 'role',
          description: 'The Role to add to all user',
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    };
  }
}
