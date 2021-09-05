import {ButtonInteraction} from 'discord.js';

export default abstract class AbstractInteraction {
  abstract readonly name: string;
  abstract execute(args: string[], interaction: ButtonInteraction): Promise<void>
}
