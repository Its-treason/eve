import { ChatInputCommandInteraction, CacheType, User, PermissionResolvable, PermissionsBitField } from 'discord.js';
import AbstractValidationHandler from '../AbstractValidationHandler';

export default class PermissionValidationHandler extends AbstractValidationHandler {
  constructor(
    private permissions: PermissionResolvable,
    private user?: User,
    private errorMsg?: string,
  ) {
    super();
  }

  public async handle(command: ChatInputCommandInteraction<CacheType>): Promise<void> {
    if (!command.guild) {
      throw new Error('"PermissionValidationHandler" can only be used in Guild context');
    }

    if (!this.user) {
      this.next?.handle(command);
      return;
    }

    const member = await command.guild.members.fetch(this.user);
    if (!member.permissions.has(this.permissions)) {
      const permissionName = new PermissionsBitField(this.permissions).toArray()[0];
      const content = this.errorMsg || `You're missing the following permission to execute this command: "${permissionName}"`;
      await this.reply(command, 'Error', content);
      return;
    }

    this.next?.handle(command);
  }
}
