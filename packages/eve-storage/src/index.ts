import initEs from "./commands/initEs";
import initDb from "./commands/initDb";

(async () => {
  const command = process.argv[process.argv.length - 1];

  switch (command) {
    case 'init-es':
      await initEs()
      break
    case 'init-db':
      await initDb()
      break
    default:
      console.error(`Unknown command '${command}'!`);
      process.exit(1)
  }
})().then(() => console.log('OK!'))
  .catch(console.error)
  .finally(() => process.exit())
