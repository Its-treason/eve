import { container, instanceCachingFactory } from 'tsyringe';
import discordApiRepositoryFactory from './Repository/Factory/discordApiRepositoryFactory';
import DiscordApiRepository from './Repository/DiscordApiRepository';

container.register(DiscordApiRepository, { useFactory: instanceCachingFactory(discordApiRepositoryFactory) });
