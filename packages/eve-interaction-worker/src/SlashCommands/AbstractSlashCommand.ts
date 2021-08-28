import {APIApplicationCommandOption} from 'discord-api-types';
import {CommandInteraction} from 'discord.js';

export default abstract class AbstractSlashCommand {
  public readonly abstract data: { name: string, description: string, options: APIApplicationCommandOption[]; };
  public abstract execute(interaction: CommandInteraction): Promise<void>;
}
