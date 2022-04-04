import { ApiClient } from './ApiClient';
import { getRedisClient } from './getRedisClient';

let client: ApiClient;

export default async function getApiClient(): Promise<ApiClient> {
  if (client) {
    return client;
  }

  if (!process.env.DISCORD_TOKEN) {
    throw new Error('Token missing');
  }

  const redisClient = await getRedisClient();

  client = new ApiClient(process.env.DISCORD_TOKEN, redisClient);
  return client;
}
