import { ChatInputCommandInteraction, CacheType, User } from 'discord.js';
import AbstractValidationHandler from '../AbstractValidationHandler';

export default class UserIsGuildMember extends AbstractValidationHandler {
  constructor(
    private user?: User,
    private errorMsg?: string,
  ) {
    super();
  }

  public async handle(command: ChatInputCommandInteraction<CacheType>): Promise<void> {
    if (!command.guild) {
      throw new Error('"UserIsGuildMember" can only be used in Guild context');
    }

    if (!this.user) {
      this.next?.handle(command);
      return;
    }

    try {
      await command.guild.members.fetch({ user: this.user, force: true });
    } catch (e) {
      await this.reply(command, 'Error', this.errorMsg || `"${this.user.username}" is not a member of this server`);
      return;
    }

    await this.next?.handle(command);
  }
}
