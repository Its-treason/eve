import { Injectable } from 'injection-js';
import GuildCreateEventHandler from '../Events/GuildCreateEventHandler';
import GuildDeleteEventHandler from '../Events/GuildDeleteEventHandler';
import RateLimitEventHandler from '../Events/RateLimitEventHandler';
import VoiceStateUpdateHandler from '../Events/VoiceStateUpdateHandler';
import WarnEventHandler from '../Events/WarnEventHandler';
import AbstractEventHandler from '../Events/AbstractEventHandler';

@Injectable()
export class EventHandlerCollection {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private guildCreateHandler: GuildCreateEventHandler,
    private guildDeleteHandler: GuildDeleteEventHandler,
    private rateLimitHandler: RateLimitEventHandler,
    private voiceStateUpdateHandler: VoiceStateUpdateHandler,
    private warnHandler: WarnEventHandler,
  ) {}

  public getAll(): AbstractEventHandler[] {
    return [
      this.guildCreateHandler,
      this.guildDeleteHandler,
      this.rateLimitHandler,
      this.voiceStateUpdateHandler,
      this.warnHandler,
    ];
  }
}
