import Logger from './Logger';
let logger: Logger;

export default function getLogger(): Logger {
  if (logger) {
    return logger;
  }

  logger = new Logger();
  return logger;
}
