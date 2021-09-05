import {CommandInteraction} from 'discord.js';
import AbstractSlashCommand from '../../AbstractSlashCommand';
import PlaylistListCommand from './PlaylistListCommand';
import PlaylistSaveCommand from './PlaylistSaveCommand';
import PlaylistLoadCommand from './PlaylistLoadCommand';
import AbstractSubSlashCommand from '../../AbstractSubSlashCommand';
import SubCommandNotFoundError from '../../../Error/SubCommandNotFoundError';
import PlaylistDeleteCommand from './PlaylistDeleteCommand';

export default class PlaylistCommand extends AbstractSlashCommand {
  private subCommands: Map<string, AbstractSubSlashCommand>;

  constructor() {
    const subCommands = new Map<string, AbstractSubSlashCommand>();
    const listCommand = new PlaylistListCommand();
    subCommands.set(listCommand.data.name, listCommand);
    const loadCommand = new PlaylistLoadCommand();
    subCommands.set(loadCommand.data.name, loadCommand);
    const saveCommand = new PlaylistSaveCommand();
    subCommands.set(saveCommand.data.name, saveCommand);
    const deleteCommand = new PlaylistDeleteCommand();
    subCommands.set(deleteCommand.data.name, deleteCommand);

    super({
      name: 'playlist',
      description: 'Manage Playlists',
      options: [
        listCommand.data,
        loadCommand.data,
        saveCommand.data,
        deleteCommand.data,
      ],
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
