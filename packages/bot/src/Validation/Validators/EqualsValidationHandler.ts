import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import AbstractValidationHandler from '../AbstractValidationHandler';

export default class EqualsValidationHandler extends AbstractValidationHandler {
  constructor(
    private value1: string,
    private value2: string,
    private errorMsg: string,
  ) {
    super();
  }

  public async handle(command: ChatInputCommandInteraction<CacheType>): Promise<void> {
    if (this.value1 !== this.value2) {
      await this.reply(command, 'Error', this.errorMsg);
      return;
    }

    this.next?.handle(command);
  }
}
