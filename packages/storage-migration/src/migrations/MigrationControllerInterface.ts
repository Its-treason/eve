export default interface MigrationControllerInterface {
  doMigrate(): Promise<void>;
}
