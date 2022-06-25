import { RateLimitData } from 'discord.js';
import { injectable } from 'tsyringe';
import EventHandlerInterface from './EventHandlerInterface';
import Logger from "../Structures/Logger";

@injectable()
export default class RateLimitEventHandler implements EventHandlerInterface {
  constructor(
    private logger: Logger,
  ) {}

  public getNameEventName(): string {
    return 'rateLimit';
  }

  public async execute(rateLimitData: RateLimitData): Promise<void> {
    this.logger.warning('Hit rate limit', {
      endpoint: `${rateLimitData.method} ${rateLimitData.route}`,
      limit: rateLimitData.limit,
    });
  }
}
