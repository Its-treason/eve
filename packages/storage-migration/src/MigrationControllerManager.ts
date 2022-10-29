import { singleton } from 'tsyringe';
import MigrationController1 from './migrations/MigrationController1';
import MigrationControllerInterface from './migrations/MigrationControllerInterface';

@singleton()
export default class MigrationControllerManager {
  private controller: MigrationControllerInterface[] = [];

  constructor(
    controller1: MigrationController1,
  ) {
    this.controller.push(controller1);
  }

  public async migrateToVersion(version: number): Promise<void> {
    const controller = this.controller[version];
    if (!controller) {
      throw new Error(`No MigrationController defined for version "${version}"`);
    }

    await controller.doMigrate();
  }

  public getLatestVersion(): number {
    return this.controller.length;
  }
}
