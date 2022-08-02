import { Logger } from 'eve-core';
import { createClient, RedisClientType } from 'redis';
import { container } from 'tsyringe';
import DiscordApiRepository from '../Repository/DiscordApiRepository';

export default function discordApiRepositoryFactory(): DiscordApiRepository {
  const logger = container.resolve(Logger);

  const url = process.env.REDIS_URL;

  const redisClient = createClient({ url });
  redisClient.connect();

  return new DiscordApiRepository(logger, (redisClient as RedisClientType));
}
