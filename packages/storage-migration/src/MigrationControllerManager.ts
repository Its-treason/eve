import { singleton } from 'tsyringe';
import MigrationController1 from './migrations/MigrationController1';
import MigrationController2 from './migrations/MigrationController2';
import MigrationController3 from './migrations/MigrationController3';
import MigrationController4 from './migrations/MigrationController4';
import MigrationControllerInterface from './migrations/MigrationControllerInterface';

@singleton()
export default class MigrationControllerManager {
  private controller: MigrationControllerInterface[] = [];

  constructor(
    controller1: MigrationController1,
    controller2: MigrationController2,
    controller3: MigrationController3,
    controller4: MigrationController4,
  ) {
    this.controller.push(controller1);
    this.controller.push(controller2);
    this.controller.push(controller3);
    this.controller.push(controller4);
  }

  public async migrateToVersion(version: number): Promise<void> {
    const controller = this.controller[version];
    if (!controller) {
      throw new Error(`No MigrationController defined for version "${version}"`);
    }

    try {
      await controller.doMigrate();
    } catch (error) {
      console.log('Failed to migrate Storage', error);
    }
  }

  public getLatestVersion(): number {
    return this.controller.length;
  }
}
