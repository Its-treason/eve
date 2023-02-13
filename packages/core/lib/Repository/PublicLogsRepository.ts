import { Client } from '@elastic/elasticsearch';
import { singleton } from 'tsyringe';
import { PublicLogCategories, PublicLogRecord } from '../types';
import dayjs from 'dayjs';

@singleton()
export default class PublicLogsRepository {
  constructor(
    private client: Client,
  ) {}

  public async createLog(
    message: string,
    categorie: PublicLogCategories,
    relatedServer: string[],
    relatedUser: string[],
  ): Promise<void> {
    await this.client.index({
      index: 'eve-public-logs',
      document: {
        message,
        categorie,
        relatedServer,
        relatedUser,
        timestamp: dayjs().format(),
        '@timestamp': dayjs().format(),
      },
    });
  }

  public async getLogsForServer(serverId: string): Promise<PublicLogRecord[]> {
      const response = await this.client.search({
        index: 'eve-public-logs',
        sort: [
          { timestamp: 'desc' },
        ],
        query: {
          match: {
            relatedServer: serverId,
          },
        },
      });

      return response.hits.hits.map((hit) => (hit._source as PublicLogRecord));
  }

  public async getLogsForUser(userId: string): Promise<PublicLogRecord[]> {
    const response = await this.client.search({
      index: 'eve-public-logs',
      sort: [
        { timestamp: 'desc' },
      ],
      query: {
        match: {
          relatedUser: userId,
        },
      },
    });

    return response.hits.hits.map((hit) => (hit._source as PublicLogRecord));
  }
}
