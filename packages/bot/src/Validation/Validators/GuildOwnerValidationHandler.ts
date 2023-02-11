import { ChatInputCommandInteraction, CacheType, User } from 'discord.js';
import AbstractValidationHandler from '../AbstractValidationHandler';

export default class GuildOwnerValidationHandler extends AbstractValidationHandler {
  constructor(
    private user?: User,
    private errorMsg?: string,
  ) {
    super();
  }

  public async handle(command: ChatInputCommandInteraction<CacheType>): Promise<void> {
    if (!command.guild) {
      throw new Error('"GuildOwnerValidationHandler" can only be used in Guild context');
    }

    if (!this.user) {
      this.next?.handle(command);
      return;
    }

    if (command.guild.ownerId !== this.user.id) {
      const content = this.errorMsg || `Error "${this.user.username}" must be the owner of this server`;
      await this.reply(command, 'Error', content);
      return;
    }

    this.next?.handle(command);
  }
}
