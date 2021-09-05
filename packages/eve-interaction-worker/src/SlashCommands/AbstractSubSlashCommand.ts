import {ApplicationCommandSubCommandData, CommandInteraction} from 'discord.js';

export default abstract class AbstractSubSlashCommand {
  public data: ApplicationCommandSubCommandData;
  public abstract execute(interaction: CommandInteraction): Promise<void>;

  protected constructor(data: ApplicationCommandSubCommandData) {
    this.data = data;
  }
}
