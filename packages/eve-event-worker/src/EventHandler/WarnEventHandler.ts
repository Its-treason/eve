import Logger from '../Util/Logger';
import EventHandler from './EventHandler';
import { injectable } from 'tsyringe';

@injectable()
export default class WarnEventHandler implements EventHandler {
  constructor(
    private logger: Logger
  ) {}

  public getNameEventName(): string {
    return 'warn';
  }

  public async execute(info: string): Promise<void> {
    this.logger.warning('General warning emitted', { info });
  }
}
