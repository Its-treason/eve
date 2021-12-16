import { Client } from '@elastic/elasticsearch';
import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

type Context = {[key: string]: (string|number|Error|boolean)};

export default class Logger {
  private logger: winston.Logger;

  constructor() {
    const client = new Client({
      node: process.env.ELASTIC_HOST,
      auth: {
        username: process.env.ELASTIC_USERNAME || '',
        password: process.env.ELASTIC_PASSWORD || '',
      },
    });

    this.logger = winston.createLogger({
      level: 'info',
      levels: winston.config.syslog.levels,
      format: winston.format.json(),
      defaultMeta: { channel: 'eve-interaction-worker' },
      transports: [
        new winston.transports.Console(),
        new ElasticsearchTransport({
          index: `eve-logs-${process.env.NODE_ENV}`,
          ensureIndexTemplate: true,
          client: client,
        }),
      ],
    });
  }

  private static formatError(error: Error): {message: string, name: string, location: string} {
    return {
      message: error.message,
      name: error.name,
      location: error.stack || 'Unknown',
    };
  }

  debug(message: string, context: Context = {}): void {
    if (context.error instanceof Error) {
      context.error = Logger.formatError(context.error);
    }

    this.logger.debug(message, context);
  }

  info(message: string, context: Context = {}): void {
    if (context.error instanceof Error) {
      context.error = Logger.formatError(context.error);
    }

    this.logger.info(message, context);
  }

  notice(message: string, context: Context = {}): void {
    if (context.error instanceof Error) {
      context.error = Logger.formatError(context.error);
    }

    this.logger.notice(message, context);
  }

  warning(message: string, context: Context = {}): void {
    if (context.error instanceof Error) {
      context.error = Logger.formatError(context.error);
    }

    this.logger.warning(message, context);
  }

  error(message: string, context: Context = {}): void {
    if (context.error instanceof Error) {
      context.error = Logger.formatError(context.error);
    }

    this.logger.error(message, context);
  }

  critical(message: string, context: Context = {}): void {
    if (context.error instanceof Error) {
      context.error = Logger.formatError(context.error);
    }

    this.logger.crit(message, context);
  }
}
