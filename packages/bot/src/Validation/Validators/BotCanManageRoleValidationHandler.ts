import { ChatInputCommandInteraction, CacheType, PermissionFlagsBits, User, PermissionResolvable, APIRole, Role } from 'discord.js';
import AbstractValidationHandler from '../AbstractValidationHandler';

export default class BotCanManageRoleValidationHandler extends AbstractValidationHandler {
  constructor(
    private role: APIRole|Role,
    private errorMsg?: string,
  ) {
    super();
  }

  public async handle(command: ChatInputCommandInteraction<CacheType>): Promise<void> {
    if (!command.guild || !command.client.user) {
      throw new Error('"BotCanManageRoleValidationHandler" can only be used in Guild context');
    }

    if (this.role.managed) {
      const content = this.errorMsg || `Can\'t use role "${this.role.name}" because it is managed by an other application!`;
      await this.reply(command, 'Error', content);
      return;
    }

    const member = await command.guild.members.fetch(command.client.user);
    if (member.roles.highest.position <= this.role.position) {
      const content = this.errorMsg || `Can\'t use role "${this.role.name}" because it has a higher order than my own!`;
      await this.reply(command, 'Error', content)
      return;
    }

    this.next?.handle(command);
  }
}
