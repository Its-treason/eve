/* eslint-disable semi */
import { ButtonInteraction } from 'discord.js';

export default interface ButtonInteractionInterface {
  getName(): string;

  execute(args: string[], interaction: ButtonInteraction): Promise<void>
}
