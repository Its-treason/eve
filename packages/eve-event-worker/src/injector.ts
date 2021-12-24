import EveClient from './Structures/EveClient';
import VoiceStateUpdateHandler from './Events/VoiceStateUpdateHandler';
import ChannelActivityProjection from './Projection/ChannelActivityProjection';
import RateLimitEventHandler from './Events/RateLimitEventHandler';
import WarnEventHandler from './Events/WarnEventHandler';
import GuildCreateEventHandler from './Events/GuildCreateEventHandler';
import GuildDeleteEventHandler from './Events/GuildDeleteEventHandler';
import { ReflectiveInjector } from 'injection-js';
import MySQLClient from './Structures/MySQLClient';
import mySqlClientFactory from './Factory/mySqlClientFactory';
import { EventHandlerCollection } from './Structures/EventHandlerCollection';
import Logger from './Util/Logger';

const injector = ReflectiveInjector.resolveAndCreate([
  VoiceStateUpdateHandler,
  ChannelActivityProjection,
  RateLimitEventHandler,
  WarnEventHandler,
  GuildCreateEventHandler,
  GuildDeleteEventHandler,
  EventHandlerCollection,
  ChannelActivityProjection,
  EveClient,
  { provide: MySQLClient, useFactory: mySqlClientFactory },
  Logger,
]);

export default injector;
