import { ChatInputCommandInteraction, CacheType, User } from 'discord.js';
import AbstractValidationHandler from '../AbstractValidationHandler';

export default class UserBannedValidationHandler extends AbstractValidationHandler {
  constructor(
    private user?: User,
    private errorMsg?: string,
  ) {
    super();
  }

  public async handle(command: ChatInputCommandInteraction<CacheType>): Promise<void> {
    if (!command.guild) {
      throw new Error('"UserBannedValidationHandler" can only be used in Guild context');
    }

    if (!this.user) {
      this.next?.handle(command);
      return
    }

    try {
      await command.guild.bans.fetch({ user: this.user, force: true });
    } catch (e) {
      if ((e as Error).message !== 'Unknown Ban') {
        throw e;
      }

      await this.reply(command, 'Error', this.errorMsg || `"${this.user.username}" is banned in this server!`);
      return;
    }

    this.next?.handle(command);
  }
}
