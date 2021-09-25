import { ApplicationCommandSubCommandData, CommandInteraction } from 'discord.js';
import AbstractSlashCommand from '../../AbstractSlashCommand';
import AbstractSubSlashCommand from '../../AbstractSubSlashCommand';
import SubCommandNotFoundError from '../../../Error/SubCommandNotFoundError';

export default class PlaylistCommand extends AbstractSlashCommand {
  private subCommands: Map<string, AbstractSubSlashCommand>;

  constructor(
    subCommandsArray: AbstractSubSlashCommand[],
  ) {
    const subCommands = new Map<string, AbstractSubSlashCommand>();

    const options = subCommandsArray.map((subCommand): ApplicationCommandSubCommandData => {
      subCommands.set(subCommand.data.name, subCommand);

      return subCommand.data;
    });

    subCommands.values();

    super({
      name: 'playlist',
      description: 'Manage Playlists',
      options,
    });

    this.subCommands = subCommands;
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const subCommand = interaction.options.getSubcommand(true);

    if (this.subCommands.has(subCommand) === true) {
      await this.subCommands.get(subCommand).execute(interaction);
      return;
    }

    throw new SubCommandNotFoundError(`"${subCommand}" SubCommand not Found in PlaylistCommand!`);
  }
}
