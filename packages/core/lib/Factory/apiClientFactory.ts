import { createClient, RedisClientType } from 'redis';
import ApiClient from '../ApiClient';

export default function apiClientFactory(): ApiClient {
  if (!process.env.DISCORD_TOKEN || !process.env.REDIS_URL) {
    throw new Error('"DISCORD_TOKEN" or "REDIS_URL" enviroment variable not set');
  }

  const url = process.env.REDIS_URL;

  const redisClient = createClient({ url });
  redisClient.connect();

  return new ApiClient(process.env.DISCORD_TOKEN, (redisClient as RedisClientType));
}
