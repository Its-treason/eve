import { createClient, RedisClientType } from 'redis';

let client: RedisClientType;

export async function getRedisClient(): Promise<RedisClientType> {
  if (client) {
    return client;
  }

  const url = process.env.REDIS_URL;

  client = createClient({ url });
  await client.connect();

  return client;
}
