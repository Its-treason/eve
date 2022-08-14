/* eslint-disable semi */
import { ApplicationCommandSubCommandData, CommandInteraction } from 'discord.js';

export default interface SubSlashCommandInterface {
  execute(interaction: CommandInteraction): Promise<void>;

  getData(): ApplicationCommandSubCommandData;

}
