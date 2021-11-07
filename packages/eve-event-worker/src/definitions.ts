import { factory } from 'treason-di';
import eveClientFactory from './Factory/eveClientFactory';
import EveClient from './Structures/EveClient';
import connectionFactory from './Factory/connectionFactory';
import { EventStore } from './eventStore/EventStore';
import eventStoreFactory from './eventStore/Factory/EventStoreFactory';
import eventHandlerArrayFactory from './Factory/eventHandlerArrayFactory';
import VoiceStateUpdateHandler from './Events/VoiceStateUpdateHandler';
import voiceStateUpdateHandlerFactory from './Events/Factory/voiceStateUpdateHandlerFactory';
import ChannelActivityProjection from './Projection/ChannelActivityProjection';
import channelActivityProjectionFactory from './Projection/Factory/channelActivityProjectionFactory';
import RateLimitEventHandler from './Events/RateLimitEventHandler';
import rateLimitEventHandlerFactory from './Events/Factory/rateLimitEventHandlerFactory';
import WarnEventHandler from './Events/WarnEventHandler';
import warnEventHandlerFactory from './Events/Factory/warnEventHandlerFactory';

const definitions = new Map();
definitions.set(EveClient, factory(eveClientFactory));
definitions.set(EventStore, factory(eventStoreFactory));
definitions.set('Connection', factory(connectionFactory));
definitions.set('EventHandler', factory(eventHandlerArrayFactory));
definitions.set(VoiceStateUpdateHandler, factory(voiceStateUpdateHandlerFactory));
definitions.set(ChannelActivityProjection, factory(channelActivityProjectionFactory));
definitions.set(RateLimitEventHandler, factory(rateLimitEventHandlerFactory));
definitions.set(WarnEventHandler, factory(warnEventHandlerFactory));

export default definitions;
