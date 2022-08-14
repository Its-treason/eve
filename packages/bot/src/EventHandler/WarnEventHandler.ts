import EventHandlerInterface from './EventHandlerInterface';
import { injectable } from 'tsyringe';
import { Logger } from '@eve/core';

@injectable()
export default class WarnEventHandler implements EventHandlerInterface {
  constructor(
    private logger: Logger,
  ) {}

  public getNameEventName(): string {
    return 'warn';
  }

  public async execute(info: string): Promise<void> {
    this.logger.warning('General warning emitted', { info });
  }
}
