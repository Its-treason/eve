/* eslint-disable semi */
import { ApplicationCommandSubCommandData, CommandInteraction } from 'discord.js';

export default interface SubSlashCommandInterface {
  getData(): ApplicationCommandSubCommandData;

  execute(interaction: CommandInteraction): Promise<void>;
}
