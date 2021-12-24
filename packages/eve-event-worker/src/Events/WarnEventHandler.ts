import AbstractEventHandler from './AbstractEventHandler';
import Logger from '../Util/Logger';
import { Injectable } from 'injection-js';

@Injectable()
export default class WarnEventHandler extends AbstractEventHandler {
  private logger: Logger;

  constructor(logger: Logger) {
    super('warn');

    this.execute = this.execute.bind(this);
    this.logger = logger;
  }

  public async execute(info: string): Promise<void> {
    this.logger.warning('General warning emitted', { info });
  }
}
