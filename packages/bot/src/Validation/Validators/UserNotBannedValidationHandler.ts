import { ChatInputCommandInteraction, CacheType, User } from 'discord.js';
import AbstractValidationHandler from '../AbstractValidationHandler';

export default class UserNotBannedValidationHandler extends AbstractValidationHandler {
  constructor(
    private user?: User,
    private errorMsg?: string,
  ) {
    super();
  }

  public async handle(command: ChatInputCommandInteraction<CacheType>): Promise<void> {
    if (!command.guild) {
      throw new Error('"UserNotBannedValidationHandler" can only be used in Guild context');
    }

    if (!this.user) {
      this.next?.handle(command);
      return;
    }

    try {
      await command.guild.bans.fetch({ user: this.user, force: true });
    } catch (e) {
      if ((e as Error).message !== 'Unknown Ban') {
        throw e;
      }

      this.next?.handle(command);
      return;
    }

    await this.reply(command, 'Error', this.errorMsg || `"${this.user.username}" is not banned in this server!`);
  }
}
