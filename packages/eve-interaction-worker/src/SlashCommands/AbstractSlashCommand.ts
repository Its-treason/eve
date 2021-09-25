import { ApplicationCommandData, CommandInteraction } from 'discord.js';

export default abstract class AbstractSlashCommand {
  public data: ApplicationCommandData;
  public abstract execute(interaction: CommandInteraction): Promise<void>;

  protected constructor(data: ApplicationCommandData) {
    this.data = data;
  }
}
