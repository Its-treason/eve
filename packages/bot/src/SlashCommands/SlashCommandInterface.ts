/* eslint-disable semi */
import { ApplicationCommandData, ChatInputCommandInteraction } from 'discord.js';

export default interface SlashCommandInterface {
  execute(interaction: ChatInputCommandInteraction): Promise<void>;

  getData(): ApplicationCommandData;
}
