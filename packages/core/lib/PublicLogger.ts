import dayjs from 'dayjs';
import { APIEmbed } from 'discord-api-types/v9';
import { singleton } from 'tsyringe';
import ApiClient from './ApiClient';
import PublicLogsRepository from './Repository/PublicLogsRepository';
import ServerSettingsRepository from './Repository/ServerSettingsRepository';
import PublicLogsSubscriptionSetting from './ServerSettings/PublicLogsSubscriptionSetting';
import { PublicLogCategories } from './types';

@singleton()
export default class PublicLogger {
  constructor(
    private logsRepository: PublicLogsRepository,
    private serverSettingsRepository: ServerSettingsRepository,
    private apiClient: ApiClient,
  ) { }

  /**
   * @param {string[]} relatedUser These should be in the order, they are named in the message
   */
  public async createLog(
    message: string,
    categorie: PublicLogCategories,
    relatedServer: string[],
    relatedUser: string[],
  ): Promise<void> {
    await this.logsRepository.createLog(message, categorie, relatedServer, relatedUser);

    for (const server of relatedServer) {
      await this.sendServerMessage(message, categorie, server, relatedUser);
    }
  }

  private async sendServerMessage(
    message: string,
    categorie: PublicLogCategories,
    currentServer: string,
    relatedUser: string[],
  ): Promise<void> {
    const subscription = await this.serverSettingsRepository.getSetting(
      currentServer, PublicLogsSubscriptionSetting.TOPIC,
    ) as PublicLogsSubscriptionSetting;

    const payload = subscription.getPayload();

    if (
      !payload.enabled ||
      !payload.wantedCategories.includes(categorie)
    ) {
      return;
    }

    const embed: APIEmbed = {
      title: 'Log',
      description: message,
      fields: [
        { name: 'Related User', value: relatedUser.map((userId) => `<@${userId}>`).join(', ') },
      ],
      color: parseInt('b4dbe0', 16),
      timestamp: dayjs().toISOString(),
    };

    await this.apiClient.sendMessage(payload.channel, { embeds: [embed] });
  }
}
