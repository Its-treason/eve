import { ChatInputCommandInteraction } from 'discord.js';
import AbstractValidationHandler from './AbstractValidationHandler';
import CallConcreteHandler from './Validators/CallConcreteHandler';

export default class CommandValidator {
  async validate(
    interaction: ChatInputCommandInteraction,
    validators: AbstractValidationHandler[],
    callback: (command: ChatInputCommandInteraction) => Promise<void>,
  ): Promise<void> {
    validators.push(new CallConcreteHandler(callback));
  
    for (let i = 0; i < validators.length; i++) {
      if (!validators[i + 1]) {
        continue;
      }
      validators[i].setNext(validators[i + 1]);
    }
    await validators[0].handle(interaction);
  }
}
