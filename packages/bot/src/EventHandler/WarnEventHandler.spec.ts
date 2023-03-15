import WarnEventHandler from './WarnEventHandler';
import { Logger, mockClass, PublicLogger } from '@eve/core';
import { describe } from 'node:test';

describe('WarnEventHandler', () => {
  let eventHandler: WarnEventHandler;

  let logger: Logger;

  beforeEach(() => {
    logger = mockClass(Logger);

    eventHandler = new WarnEventHandler(logger);
  });

  describe('execute', () => {
    it('Can log when waring ocurred', async () => {
      const info = 'Some warning';

      await eventHandler.execute(info);

      expect(logger.warning).toBeCalledWith('General warning emitted', { info });
    });
  });

  describe('getEventName', () => {
    it('Can return the EventName', () => {
      const expected = 'warn';

      expect(eventHandler.getEventName()).toBe(expected);
    });
  });
});
