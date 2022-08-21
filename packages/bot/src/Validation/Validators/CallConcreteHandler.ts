import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import AbstractValidationHandler from '../AbstractValidationHandler';

export default class CallConcreteHandler extends AbstractValidationHandler {
  constructor(
    private callback: (command: ChatInputCommandInteraction) => void,
  ) {
    super();
  }

  public handle(command: ChatInputCommandInteraction<CacheType>): void {
    if (this.next) {
      throw new Error('"CallConcreteHandler" must be at the end of the chain');
    }

    this.callback(command);
  }
}
