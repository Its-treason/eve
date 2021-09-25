import { ButtonInteraction } from 'discord.js';

export default abstract class AbstractButtonInteraction {
  constructor(name: string) {
    this.name = name;
  }

  readonly name: string;
  abstract execute(args: string[], interaction: ButtonInteraction): Promise<void>
}
