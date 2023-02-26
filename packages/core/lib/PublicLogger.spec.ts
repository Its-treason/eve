import dayjs from 'dayjs';
import ApiClient from './ApiClient';
import PublicLogger from './PublicLogger'
import PublicLogsRepository from './Repository/PublicLogsRepository';
import ServerSettingsRepository from './Repository/ServerSettingsRepository';
import PublicLogsSubscriptionSetting from './ServerSettings/PublicLogsSubscriptionSetting';
import { PublicLogCategories } from './types';



describe('PublicLogger', () => {
  let publicLogger: PublicLogger;

  let logsRepository: PublicLogsRepository;
  let serverSettingsRepository: ServerSettingsRepository;
  let apiClient: ApiClient;

  beforeEach(() => {
    logsRepository = {} as PublicLogsRepository;
    serverSettingsRepository = {} as ServerSettingsRepository;
    apiClient = {} as ApiClient;

    publicLogger = new PublicLogger(logsRepository, serverSettingsRepository, apiClient);

    jest.useFakeTimers();
    jest.setSystemTime(new Date(2020, 3, 1));
  });

  describe('createLog', () => {
    it('Can log and send a message', async () => {
      logsRepository.createLog = jest.fn();

      serverSettingsRepository.getSetting = jest.fn(async () => {
        return PublicLogsSubscriptionSetting.fromPayload({
          wantedCategories: [PublicLogCategories.CommandUsed],
          enabled: true,
          channel: '372762707260342273',
        })
      })

      apiClient.sendMessage = jest.fn();

      await publicLogger.createLog(
        'Jest test',
        PublicLogCategories.CommandUsed,
        ['395676259922739212'],
        ['492435232071483392', '898676414688145449'],
      );

      expect(logsRepository.createLog).toBeCalledWith(
        'Jest test',
        PublicLogCategories.CommandUsed,
        ['395676259922739212'],
        ['492435232071483392', '898676414688145449']
      );

      expect(serverSettingsRepository.getSetting)
        .toBeCalledWith('395676259922739212', PublicLogsSubscriptionSetting.TOPIC);

      const embed = {
        title: 'Log',
        description: 'Jest test',
        fields: [
          { name: 'Related User', value: '<@492435232071483392>, <@898676414688145449>' },
        ],
        color: parseInt('b4dbe0', 16),
        timestamp: dayjs().toISOString(),
      }

      expect(apiClient.sendMessage).toBeCalledWith('372762707260342273', { embeds: [embed] });
    });

    it('Can log and not send a message because its disabled', async () => {
      logsRepository.createLog = jest.fn();

      serverSettingsRepository.getSetting = jest.fn(async () => {
        return PublicLogsSubscriptionSetting.fromPayload({
          wantedCategories: [PublicLogCategories.CommandUsed],
          enabled: false,
          channel: '372762707260342273',
        });
      });

      apiClient.sendMessage = jest.fn();

      await publicLogger.createLog(
        'Jest test',
        PublicLogCategories.CommandUsed,
        ['395676259922739212'],
        ['492435232071483392', '898676414688145449'],
      );

      expect(logsRepository.createLog).toBeCalledWith(
        'Jest test',
        PublicLogCategories.CommandUsed,
        ['395676259922739212'],
        ['492435232071483392', '898676414688145449']
      );

      expect(serverSettingsRepository.getSetting)
        .toBeCalledWith('395676259922739212', PublicLogsSubscriptionSetting.TOPIC);

      expect(apiClient.sendMessage).not.toBeCalledWith();
    });

    it('Can log and not send a message because categorie is not wanted', async () => {
      logsRepository.createLog = jest.fn();

      serverSettingsRepository.getSetting = jest.fn(async () => {
        return PublicLogsSubscriptionSetting.fromPayload({
          wantedCategories: [PublicLogCategories.NativeModerationAction],
          enabled: true,
          channel: '372762707260342273',
        });
      });

      apiClient.sendMessage = jest.fn();

      await publicLogger.createLog(
        'Jest test',
        PublicLogCategories.CommandUsed,
        ['395676259922739212'],
        ['492435232071483392', '898676414688145449'],
      );

      expect(logsRepository.createLog).toBeCalledWith(
        'Jest test',
        PublicLogCategories.CommandUsed,
        ['395676259922739212'],
        ['492435232071483392', '898676414688145449']
      );

      expect(serverSettingsRepository.getSetting)
        .toBeCalledWith('395676259922739212', PublicLogsSubscriptionSetting.TOPIC);

      expect(apiClient.sendMessage).not.toBeCalledWith();
    });
  });
});

