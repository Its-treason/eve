import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import AbstractValidationHandler from '../AbstractValidationHandler';

export default class NotInGuildValidationHandler extends AbstractValidationHandler {
  constructor(
    private errorMsg: string,
  ) {
    super();
  }

  public async handle(command: ChatInputCommandInteraction<CacheType>): Promise<void> {
    if (command.inGuild()) {
      await this.reply(command, 'Error', this.errorMsg);
      return;
    }

    this.next?.handle(command);
  }
}
