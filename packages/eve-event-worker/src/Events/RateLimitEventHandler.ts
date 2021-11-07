import { RateLimitData } from 'discord.js';
import AbstractEventHandler from './AbstractEventHandler';
import Logger from '../Util/Logger';

export default class RateLimitEventHandler extends AbstractEventHandler {
  private logger: Logger;

  constructor(logger: Logger) {
    super('rateLimit');

    this.execute = this.execute.bind(this);
    this.logger = logger;
  }

  public async execute(rateLimitData: RateLimitData): Promise<void> {
    this.logger.warning('Hit rate limit', {
      endpoint: `${rateLimitData.method} ${rateLimitData.route}`,
      limit: rateLimitData.limit,
    });
  }
}
