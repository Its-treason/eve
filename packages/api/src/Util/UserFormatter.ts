import { APIGuild } from 'discord-api-types/v9';
import { ApiClient, ApiKeysRepository, PermissionRepository } from '@eve/core';
import { singleton } from 'tsyringe';
import DiscordApiRepository from '../Repository/DiscordApiRepository';
import { ReducedServer, ReducedUser } from '../Web/sharedApiTypes';
import { MultiDownloader } from './MultiDownloader';

@singleton()
export default class UserFormatter {
  constructor(
    private apiClient: ApiClient,
    private apiKeyRepository: ApiKeysRepository,
    private permissionRepository: PermissionRepository,
    private discordApiRepository: DiscordApiRepository,
  ) {}

  public async getReducedUserFromId(id: string, apiKey: string): Promise<ReducedUser|null> {
    const fullUser = await this.apiClient.getUser(id);
    if (!fullUser) {
      return null;
    }

    const { accessToken, tokenType } = await this.apiKeyRepository.getAccessTokenByApiKey(apiKey);
    if (!accessToken || !tokenType) {
      return null;
    }
    const usersGuilds = await this.discordApiRepository.getUsersGuilds(tokenType, accessToken);
    if (usersGuilds === null) {
      return null;
    }

    const admin = await this.permissionRepository.isUserAdmin(id);

    const mutualGuild: (null|APIGuild)[] = await this.getMutualGuildConcurrent(usersGuilds);

    const server: ReducedServer[] = [];
    for (const guild of mutualGuild) {
      if (!guild || (guild.owner_id !== id && !admin)) {
        continue;
      }

      server.push({
        name: guild.name,
        icon: this.apiClient.getGuildIcon(guild),
        id: guild.id,
      });
    }

    return {
      name: fullUser.username,
      icon: this.apiClient.getUserAvatar(fullUser),
      id,
      admin,
      server,
    };
  }

  private async getMutualGuildConcurrent(usersGuilds: APIGuild[]): Promise<(null|APIGuild)[]> {
    const multiDownloader = new MultiDownloader<null|APIGuild>();
    const mutualGuilds: (null|APIGuild)[] = [];

    for (const userGuild of usersGuilds) {
      mutualGuilds.push(...(await multiDownloader.download(this.apiClient.getGuild(userGuild.id))));
    }

    mutualGuilds.push(...(await multiDownloader.flush()));
  
    return mutualGuilds;
  }
}
