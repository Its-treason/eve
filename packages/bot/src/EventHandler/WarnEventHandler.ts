import EventHandlerInterface from './EventHandlerInterface';
import { injectable } from 'tsyringe';
import { Logger } from '@eve/core';

@injectable()
export default class WarnEventHandler implements EventHandlerInterface<'warn'> {
  constructor(
    private logger: Logger,
  ) {}

  public getEventName() {
    return 'warn' as const;
  }

  public async execute(info: string): Promise<void> {
    this.logger.warning('General warning emitted', { info });
  }
}
