import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import AbstractValidationHandler from '../AbstractValidationHandler';

export default class CallConcreteHandler extends AbstractValidationHandler {
  constructor(
    private callback: (command: ChatInputCommandInteraction) => void|Promise<void>,
  ) {
    super();
  }

  public async handle(command: ChatInputCommandInteraction<CacheType>): Promise<void> {
    if (this.next) {
      throw new Error('"CallConcreteHandler" must be at the end of the chain');
    }

    await this.callback(command);
  }
}
