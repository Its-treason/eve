import PermissionProjection from '../projections/PermissionProjection';
import { ReducedServer, ReducedUser } from '../web/sharedApiTypes';
import DiscordApiProjection from '../projections/DiscordApiProjection';
import ApiKeysProjection from '../projections/ApiKeysProjection';
import getApiClient from '../structures/getApiClient';
import { APIGuild } from 'discord-api-types/v9';
import { MultiDownloader } from '../music/MultiDownloader';
import { ApiClient } from '../structures/ApiClient';

export default async function getReducedUserFromId(id: string, apiKey: string): Promise<ReducedUser|null> {
  const api = await getApiClient();

  const fullUser = await api.getUser(id);
  if (!fullUser) {
    return null;
  }

  const { accessToken, tokenType } = await ApiKeysProjection.getAccessTokenByApiKey(apiKey);
  if (!accessToken || !tokenType) {
    return null;
  }
  const usersGuilds = await DiscordApiProjection.getUsersGuilds(tokenType, accessToken);
  if (usersGuilds === null) {
    return null;
  }

  const admin = await PermissionProjection.isUserAdmin(id);

  const mutualGuild: (null|APIGuild)[] = await getMutualGuildConcurrent(usersGuilds, api);

  const server: ReducedServer[] = [];
  for (const guild of mutualGuild) {
    if (!guild || (guild.owner_id !== id && !admin)) {
      continue;
    }

    server.push({
      name: guild.name,
      icon: api.getGuildIcon(guild),
      id: guild.id,
    });
  }

  return {
    name: fullUser.username,
    icon: api.getUserAvatar(fullUser),
    id,
    admin,
    server,
  };
}

async function getMutualGuildConcurrent(usersGuilds: APIGuild[], api: ApiClient): Promise<(null|APIGuild)[]> {
  const multiDownloader = new MultiDownloader<null|APIGuild>();
  const mutualGuilds: (null|APIGuild)[] = [];

  for (const userGuild of usersGuilds) {
    mutualGuilds.push(...(await multiDownloader.download(api.getGuild(userGuild.id))));
  }

  mutualGuilds.push(...(await multiDownloader.flush()));

  return mutualGuilds;
}
