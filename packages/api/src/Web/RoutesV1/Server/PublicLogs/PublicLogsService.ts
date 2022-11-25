import { ApiClient, PublicLogRecord } from '@eve/core';
import { FormattedPublicLogRecord, ReducedServer, ReducedUser } from '@eve/types/api';
import { singleton } from 'tsyringe';

@singleton()
export default class PublicLogsService {
  constructor(
    private apiClient: ApiClient,
  ) { }

  private serverMemoryCache = new Map<string, ReducedServer>();
  private userMemoryCache = new Map<string, ReducedUser>();

  public async formatRawLogs(rawLogs: PublicLogRecord[]): Promise<FormattedPublicLogRecord[]> {
    const formattedLogs: FormattedPublicLogRecord[] = [];

    for (const rawLog of rawLogs) {
      const relatedServer = await this.getRelatedServer(rawLog);
      const relatedUser = await this.getRelatedUser(rawLog);

      formattedLogs.push({
        categorie: rawLog.categorie,
        message: rawLog.message,
        timestamp: rawLog['@timestamp'],
        relatedServer,
        relatedUser,
      })
    }

    this.serverMemoryCache.clear();
    this.userMemoryCache.clear();

    return formattedLogs;
  }

  private async getRelatedServer(rawLog: PublicLogRecord): Promise<ReducedServer[]> {
    const relatedServer: ReducedServer[] = [];
    for (const serverId of rawLog.relatedServer) {
      if (this.serverMemoryCache.has(serverId)) {
        relatedServer.push(this.serverMemoryCache.get(serverId)!);
        continue;
      }

      const fullServer = await this.apiClient.getGuild(serverId);
      if (!fullServer) {
        const server = {
          name: 'N/A',
          icon: 'https://cdn.discordapp.com/embed/avatars/5.jpg',
          id: '0',
        }
        this.serverMemoryCache.set(serverId, server);

        relatedServer.push(server);
        continue;
      }

      const server = {
        icon: this.apiClient.getGuildIcon(fullServer),
        id: fullServer.id,
        name: fullServer.name,
      };
      this.serverMemoryCache.set(serverId, server);
      relatedServer.push(server);
    }

    return relatedServer;
  }

  private async getRelatedUser(rawLog: PublicLogRecord): Promise<ReducedUser[]> {
    const relatedUser: ReducedUser[] = [];
    for (const userId of rawLog.relatedUser) {
      if (this.userMemoryCache.has(userId)) {
        relatedUser.push(this.userMemoryCache.get(userId)!);
        continue;
      }

      const fullUser = await this.apiClient.getUser(userId);
      if (!fullUser) {
        const user = {
          name: 'N/A',
          icon: 'https://cdn.discordapp.com/embed/avatars/5.jpg',
          id: '0',
          admin: false,
          server: [],
        }
        this.serverMemoryCache.set(userId, user);

        relatedUser.push(user);
        continue;
      }

      const user = {
        icon: this.apiClient.getUserAvatar(fullUser),
        id: fullUser.id,
        name: fullUser.username,
        admin: false,
        server: [],
      };
      this.serverMemoryCache.set(userId, user);
      relatedUser.push(user);
    }

    return relatedUser;
  }
}
