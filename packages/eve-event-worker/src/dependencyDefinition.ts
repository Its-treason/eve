import MySQLClient from './Structure/MySQLClient';
import mySqlClientFactory from './Factory/mySqlClientFactory';
import { container, instanceCachingFactory } from 'tsyringe';
import GuildCreateEventHandler from './EventHandler/GuildCreateEventHandler';
import GuildDeleteEventHandler from './EventHandler/GuildDeleteEventHandler';
import RateLimitEventHandler from './EventHandler/RateLimitEventHandler';
import VoiceStateUpdateHandler from './EventHandler/VoiceStateUpdateHandler';
import WarnEventHandler from './EventHandler/WarnEventHandler';
import GuildMemberAddEventHandler from './EventHandler/GuildMemberAddEventHandler';
import GuildMemberRemoveEventHandler from './EventHandler/GuildMemberRemoveEventHandler';

container.register(MySQLClient, { useFactory: instanceCachingFactory(mySqlClientFactory) });
container.register('EventHandler', { useClass: GuildCreateEventHandler });
container.register('EventHandler', { useClass: GuildDeleteEventHandler });
container.register('EventHandler', { useClass: RateLimitEventHandler });
container.register('EventHandler', { useClass: VoiceStateUpdateHandler });
container.register('EventHandler', { useClass: WarnEventHandler });
container.register('EventHandler', { useClass: GuildMemberAddEventHandler });
container.register('EventHandler', { useClass: GuildMemberRemoveEventHandler });
