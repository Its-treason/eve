import formatSeconds from '../Util/formatSeconds';
import embedFactory from '../Factory/messageEmbedFactory';
import { ApplicationCommandData, ApplicationCommandOptionType, ApplicationCommandType, CommandInteraction, EmbedBuilder, User } from 'discord.js';
import SlashCommandInterface from './SlashCommandInterface';
import { injectable } from 'tsyringe';

@injectable()
export default class WhoisCommand implements SlashCommandInterface {
  async execute(interaction: CommandInteraction): Promise<void> {
    const targetUser = interaction.options.getUser('user', false);

    if (!(targetUser instanceof User)) {
      await WhoisCommand.sendWhoIs(interaction.user, interaction);
      return;
    }

    await WhoisCommand.sendWhoIs(targetUser, interaction);
  }

  private static async sendWhoIs(user: User, interaction: CommandInteraction) {
    const answer = embedFactory(interaction.client, `WhoIs: ${user.username}#${user.discriminator}`);
    answer.setDescription(`${user}`);
    answer.setThumbnail(user.avatarURL({ extension: 'png', size: 4096 }));
    answer.addFields([
      { name: 'User-Id:', value: user.id },
      { name: 'Account Created:', value: user.createdAt.toUTCString() },
      { name: 'Account Age:', value: formatSeconds(Math.floor((Date.now() - user.createdTimestamp) / 1000)) },
    ]);

    await WhoisCommand.getAttributes(user, answer, interaction);
    await interaction.reply({ embeds: [answer], allowedMentions: { users: [] } });
  }

  private static async getAttributes(user: User, answer: EmbedBuilder, interaction: CommandInteraction): Promise<void> {
    const attributes = [];

    if (user.bot === true) {
      attributes.push('- Bot Account');
    }
    if (user.system === true) {
      attributes.push('- Official Discord System User');
    }
    if (user.id === interaction.guild.ownerId) {
      attributes.push('- Owner of this Server');
    }

    if (attributes.length === 0) {
      return;
    }

    answer.addFields([
      { name: 'Attributes:', value: '```yml\n' + attributes.join('\n') + '```' },
    ]);
  }

  getData(): ApplicationCommandData {
    return {
      name: 'whois',
      description: 'Get info about user',
      type: ApplicationCommandType.ChatInput,
      options: [
        {
          name: 'user',
          description: 'User to lookup',
          type: ApplicationCommandOptionType.User,
        },
      ],
    };
  }
}
