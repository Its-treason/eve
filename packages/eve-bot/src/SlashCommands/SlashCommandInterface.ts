/* eslint-disable semi */
import { ApplicationCommandData, CommandInteraction } from 'discord.js';

export default interface SlashCommandInterface {
  execute(interaction: CommandInteraction): Promise<void>;

  getData(): ApplicationCommandData;
}
