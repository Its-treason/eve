import { RateLimitData } from 'discord.js';
import AbstractEventHandler from './AbstractEventHandler';
import Logger from '../Util/Logger';
import { Injectable } from 'injection-js';

@Injectable()
export default class RateLimitEventHandler extends AbstractEventHandler {
  constructor(
    private logger: Logger,
  ) {
    super('rateLimit');

    this.execute = this.execute.bind(this);
  }

  public async execute(rateLimitData: RateLimitData): Promise<void> {
    this.logger.warning('Hit rate limit', {
      endpoint: `${rateLimitData.method} ${rateLimitData.route}`,
      limit: rateLimitData.limit,
    });
  }
}
