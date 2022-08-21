import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import AbstractValidationHandler from '../AbstractValidationHandler';

export default class NotInDmChannelValidationHandler extends AbstractValidationHandler {
  constructor(
    private errorMsg?: string,
  ) {
    super();
  }

  public async handle(command: ChatInputCommandInteraction<CacheType>): Promise<void> {
    if (!command.inGuild()) {
      const content = this.errorMsg || 'This command can\'t be executed inside DM\'s'
      await this.reply(command, 'Error', content);
      return;
    }

    this.next?.handle(command);
  }
}
