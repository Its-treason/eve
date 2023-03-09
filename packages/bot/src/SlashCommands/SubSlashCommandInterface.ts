/* eslint-disable semi */
import { ApplicationCommandSubCommandData, ChatInputCommandInteraction } from 'discord.js';

export default interface SubSlashCommandInterface {
  execute(interaction: ChatInputCommandInteraction): Promise<void>;

  getData(): ApplicationCommandSubCommandData;
}
