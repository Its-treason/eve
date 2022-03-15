import { RateLimitData } from 'discord.js';
import Logger from '../Util/Logger';
import { injectable } from 'tsyringe';
import EventHandler from './EventHandler';

@injectable()
export default class RateLimitEventHandler implements EventHandler {
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
