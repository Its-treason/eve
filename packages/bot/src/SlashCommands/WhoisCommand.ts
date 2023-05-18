import formatSeconds from '../Util/formatSeconds';
import embedFactory from '../Factory/messageEmbedFactory';
import { ApplicationCommandData, ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, EmbedBuilder, User } from 'discord.js';
import SlashCommandInterface from './SlashCommandInterface';
import { injectable } from 'tsyringe';

@injectable()
export default class WhoisCommand implements SlashCommandInterface {
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const targetUser = interaction.options.getUser('user', false);

    if (!(targetUser instanceof User)) {
      await WhoisCommand.sendWhoIs(interaction.user, interaction);
      return;
    }

    await WhoisCommand.sendWhoIs(targetUser, interaction);
  }

  private static async sendWhoIs(user: User, interaction: ChatInputCommandInteraction) {
    // TODO: After the name convertion is done, remove this
    let discriminator = '';
    if (user.discriminator !== '0') {
      discriminator = `#${user.discriminator}`;
    }

    const answer = embedFactory(interaction.client, `Who is: ${user.username}${discriminator}`);
    answer.setDescription(`${user}`);
    answer.setThumbnail(user.avatarURL({ extension: 'webp', size: 256 }));
    answer.addFields([
      { name: 'User id:', value: user.id },
      // TODO: When display name is in Discord.js uncomment this line
      //{ name: 'Disply name', value: user.displayName },
      { name: 'Account created:', value: user.createdAt.toUTCString() },
      { name: 'Account age:', value: formatSeconds(Math.floor((Date.now() - user.createdTimestamp) / 1000)) },
    ]);

    await WhoisCommand.getBadges(user, answer);
    await WhoisCommand.getAttributes(user, answer, interaction);
    await interaction.reply({ embeds: [answer], allowedMentions: { users: [] } });
  }

  private static async getAttributes(user: User, answer: EmbedBuilder, interaction: ChatInputCommandInteraction): Promise<void> {
    const attributes = [];

    if (user.bot === true) {
      attributes.push('- Bot Account');
    }
    if (user.system === true) {
      attributes.push('- Official Discord System User');
    }
    if (user.id === interaction.guild?.ownerId) {
      attributes.push('- Owner of this Server');
    }

    if (attributes.length === 0) {
      return;
    }

    answer.addFields([
      { name: 'Attributes:', value: '```yml\n' + attributes.join('\n') + '```' },
    ]);
  }

  private static async getBadges(user: User, answer: EmbedBuilder): Promise<void> {
    const flags = user.flags?.toArray();

    if (flags === undefined || flags.length === 0) {
      return;
    }

    // See: https://discord.com/developers/docs/resources/user#user-object-user-flags
    // and: https://discord-api-types.dev/api/discord-api-types-v10/enum/UserFlags
    const message = flags.map((flag) => {
      switch (flag) {
        case 'Staff':
          return 'Staff (Discord Employee)';
        case 'Partner':
          return 'Partner (Partnered Server Owner)';
        case 'Hypesquad':
          return 'Hypesquad (HypeSquad Events Member)';
        case 'HypeSquadOnlineHouse1':
          return 'HypeSquadOnlineHouse1 (House Bravery Member)';
        case 'HypeSquadOnlineHouse2':
          return 'HypeSquadOnlineHouse2 (House Brilliance Member)';
        case 'HypeSquadOnlineHouse3':
          return 'HypeSquadOnlineHouse3 (House Balance Member)';
        case 'PremiumEarlySupporter':
          return 'PremiumEarlySupporter (Early Nitro Supporter)';
        case 'TeamPseudoUser':
          return 'TeamPseudoUser (User is a team)';
        case 'VerifiedDeveloper':
          return 'VerifiedDeveloper (Early Verfified Bot Developer)';
        case 'CertifiedModerator':
          return 'CertifiedModerator (Moderator Programs Alumni)';
        case 'BotHTTPInteractions':
          return 'BotHTTPInteractions (Bot uses only HTTP interactions and is shown in the online member list)';
        default:
          return flag;
      }
    }).join('\n');

    answer.addFields([
      { name: 'Flags:', value: '```yml\n' + message + '```' },
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
