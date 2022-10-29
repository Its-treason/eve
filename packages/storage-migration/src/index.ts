import { Logger } from '@eve/core';
import { singleton } from 'tsyringe';
import MigrationControllerManager from './MigrationControllerManager';
import MigrationSettingsRepository from './MigrationSettingsRepository';

@singleton()
export default class StorageMigrator {
  constructor(
    private migrationControllerManager: MigrationControllerManager,
    private migrationSettingsRepository: MigrationSettingsRepository,
    private logger: Logger,
  ) {}

  public async migrateToLatest(): Promise<void> {
    const currentVersion = await this.migrationSettingsRepository.getCurrentMigration();
    const latestVersion = this.migrationControllerManager.getLatestVersion();

    if (currentVersion === latestVersion) {
      this.logger.info('Nothing to migrate', {
        currentVersion,
        latestVersion,
      });
      return;
    }

    this.logger.info('Migrating storage', {
      currentVersion,
      latestVersion,
    });

    for (let i = currentVersion; i < latestVersion; i++) {
      await this.migrationControllerManager.migrateToVersion(i);
      await this.migrationSettingsRepository.updateDbMigrationVersion(i + 1);

      this.logger.info('Migrated storage', {
        currentVersion: i + 1,
        latestVersion,
      });
    }
  }
}
