import { ServerSettingsFactory } from '..';

describe('ServerSettingFactory', () => {
  const factory = new ServerSettingsFactory();
 
  describe('createAction', () => {
    it('With auto-roles', () => {
      const topic = 'auto-roles';
      const payload = {
        enabled: true,
        roles: ['12456789', '987564321'],
      };

      const action = factory.createAction(topic, payload);

      expect(action.getPayload()).toMatchObject(payload);
    });

    it('With join-message', () => {
      const topic = 'join-message';
      const payload = {
        message: 'Hello World!',
        channel: '789456213789',
        enabled: true,
      };

      const action = factory.createAction(topic, payload);

      expect(action.getPayload()).toMatchObject(payload);
    });

    it('With leave-message', () => {
      const topic = 'leave-message';
      const payload = {
        message: 'Hello World!',
        channel: '789456213789',
        enabled: true,
      };

      const action = factory.createAction(topic, payload);

      expect(action.getPayload()).toMatchObject(payload);
    });

    it('With public-logs-subscription', () => {
      const topic = 'public-logs-subscription';
      const payload = {
        wantedCategories: ['Hello World!', 'test-1-2-3'],
        channel: '789456213789',
        enabled: true,
      };

      const action = factory.createAction(topic, payload);

      expect(action.getPayload()).toMatchObject(payload);
    });

    it('Will throw error with invalid setting name', () => {
      expect(() => {
        factory.createAction('Hello world', {});
      }).toThrow('Cannot create action with name "Hello world". Unknown Action.');
    });
  });

  describe('createEmpty', () => {
    it('With auto-roles', () => {
      const topic = 'auto-roles';
      const payload = {
        enabled: false,
        roles: [],
      };

      const action = factory.createEmpty(topic);

      expect(action.getPayload()).toMatchObject(payload);
    });

    it('With join-message', () => {
      const topic = 'join-message';
      const payload = {
        message: '',
        channel: '',
        enabled: false,
      };

      const action = factory.createEmpty(topic);

      expect(action.getPayload()).toMatchObject(payload);
    });

    it('With leave-message', () => {
      const topic = 'leave-message';
      const payload = {
        message: '',
        channel: '',
        enabled: false,
      };

      const action = factory.createEmpty(topic);

      expect(action.getPayload()).toMatchObject(payload);
    });

    it('With public-logs-subscription', () => {
      const topic = 'public-logs-subscription';
      const payload = {
        wantedCategories: [],
        channel: '',
        enabled: false,
      };

      const action = factory.createEmpty(topic);

      expect(action.getPayload()).toMatchObject(payload);
    });

    it('Will throw error with invalid setting', () => {
      expect(() => {
        factory.createEmpty('Hello world');
      }).toThrow('Undefined action "Hello world"');
    });
  });
});
