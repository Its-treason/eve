import { Injectable } from 'injection-js';

@Injectable()
export default abstract class AbstractEventHandler {
  public eventName: string;

  constructor(eventName: string) {
    this.eventName = eventName;
  }

  abstract execute(...payload: unknown[]): Promise<void>;
}
