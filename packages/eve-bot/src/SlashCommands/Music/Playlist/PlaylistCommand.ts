import { ApplicationCommandData, ApplicationCommandSubCommandData, CommandInteraction } from 'discord.js';
import SlashCommandInterface from '../../SlashCommandInterface';
import SubSlashCommandInterface from '../../SubSlashCommandInterface';
import SubCommandNotFoundError from '../../../Error/SubCommandNotFoundError';
import { injectable, injectAll } from 'tsyringe';

@injectable()
export default class PlaylistCommand implements SlashCommandInterface {
  constructor(
    @injectAll('PlaylistSubCommands') private subCommands: SubSlashCommandInterface[],
  ) {}

  async execute(interaction: CommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const subCommandName = interaction.options.getSubcommand();

    const subCommand = this.subCommands.find(subcommand => subcommand.getData().name === subCommandName);

    if (subCommand) {
      await subCommand.execute(interaction);
      return;
    }

    throw new SubCommandNotFoundError(`"${subCommand}" SubCommand not Found in PlaylistCommand!`);
  }

  getData(): ApplicationCommandData {
    const options = this.subCommands.map((subCommand): ApplicationCommandSubCommandData => {
      return subCommand.getData();
    });

    return {
      name: 'playlist',
      description: 'Manage Playlists',
      options,
    };
  }
}
