import PermissionProjection from '../projections/PermissionProjection';
import { ReducedServer, ReducedUser } from '../web/sharedApiTypes';
import DiscordApiProjection from '../projections/DiscordApiProjection';
import ApiKeysProjection from '../projections/ApiKeysProjection';
import getApiClient from '../structures/getApiClient';

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

  const server: ReducedServer[] = [];
  for (const guild of usersGuilds) {
    const fullGuild = await api.getGuild(guild.id);
    if (!fullGuild || guild.owner_id !== id || !admin) {
      continue;
    }

    server.push({
      name: fullGuild.name,
      icon: api.getGuildIcon(fullGuild),
      id: fullGuild.id,
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
