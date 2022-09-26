import { ChatInputCommandInteraction, CacheType, PermissionFlagsBits, User, PermissionResolvable } from 'discord.js';
import AbstractValidationHandler from '../AbstractValidationHandler';

export default class BotPermissionValidationHandler extends AbstractValidationHandler {
  constructor(
    private permissions: PermissionResolvable,
    private errorMsg?: string,
  ) {
    super();
  }

  public async handle(command: ChatInputCommandInteraction<CacheType>): Promise<void> {
    if (!command.guild || !command.client.user) {
      throw new Error('"BotPermissionValidationHandler" can only be used in Guild context');
    }

    const member = await command.guild.members.fetch(command.client.user);
    if (!member.permissions.has(this.permissions)) {
      const content = this.errorMsg || `I\'m missing the following permission to execute this command: "${this.permissions}"`;
      await this.reply(command, 'Error', content)
      return;
    }

    this.next?.handle(command);
  }
}
