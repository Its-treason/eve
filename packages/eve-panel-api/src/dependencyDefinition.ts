import { container, instanceCachingFactory } from 'tsyringe';
import discordApiRepositoryFactory from './Factory/discordApiRepositoryFactory';
import DiscordApiRepository from './Repository/DiscordApiRepository';

container.register(DiscordApiRepository, { useFactory: instanceCachingFactory(discordApiRepositoryFactory) });
