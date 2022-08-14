import { Client } from '@elastic/elasticsearch';
import { singleton } from 'tsyringe';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Context = Record<string, any>;
type NormalisedContext = {[key: string]: boolean|string|number|string[]|number[]|NormalisedContext}
type LogLevel = 'debug'|'info'|'notice'|'warning'|'error'|'critical'|'alert'|'emergency';

@singleton()
export default class Logger {
  constructor(
    private client: Client,
  ) {}

  private static normaliseContext(rawContext: Context): NormalisedContext {
    const context: NormalisedContext = {};

    const entries = Object.entries(rawContext);
    for (const entry of entries) {
      const [key, data] = entry;

      switch (typeof data) {
        case 'string':
        case 'boolean':
        case 'number':
          context[key] = data;
          continue;
        case 'bigint':
          context[key] = data.toString();
          continue;
        case 'object':
          context[key] = Logger.normaliseContext(data);
      }
    }

    return context;
  }

  private log(message: string, level: number, levelName: LogLevel, context: Context): void {
    const normalisedContext = Logger.normaliseContext(context);

    const body = {
      message,
      level,
      'level_name': levelName,
      channel: 'eve-bot',
      timestamp: new Date().toISOString(),
      context: normalisedContext,
    };

    const logData = JSON.stringify(body, null, 2);
    console.info(logData);

    this.client.index({
      index: `eve-logs-${process.env.NODE_ENV}`,
      body,
    });
  }

  private static formatError(error: Error): {message: string, name: string, location: string} {
    return {
      message: error.message,
      name: error.name,
      location: error.stack || 'Unknown',
    };
  }

  /**
   * Detailed debug information
   */
  debug(message: string, context: Context = {}): void {
    // do not Log Debug stuff in production
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    if (context.error instanceof Error) {
      context.error = Logger.formatError(context.error);
    }

    this.log(message, 100, 'debug', context);
  }

  /**
   * Interesting events
   *
   * Examples: User logs in, SQL logs.
   */
  info(message: string, context: Context = {}): void {
    if (context.error instanceof Error) {
      context.error = Logger.formatError(context.error);
    }

    this.log(message, 200, 'info', context);
  }

  /**
   * Uncommon events
   */
  notice(message: string, context: Context = {}): void {
    if (context.error instanceof Error) {
      context.error = Logger.formatError(context.error);
    }

    this.log(message, 250, 'notice', context);
  }

  /**
   * Exceptional occurrences that are not errors
   *
   * Examples: Use of deprecated APIs, poor use of an API,
   * undesirable things that are not necessarily wrong.
   */
  warning(message: string, context: Context = {}): void {
    if (context.error instanceof Error) {
      context.error = Logger.formatError(context.error);
    }

    this.log(message, 300, 'warning', context);
  }

  /**
   * Runtime errors
   */
  error(message: string, context: Context = {}): void {
    if (context.error instanceof Error) {
      context.error = Logger.formatError(context.error);
    }

    this.log(message, 400, 'error', context);
  }

  /**
   * Critical conditions
   *
   * Example: Application component unavailable, unexpected exception.
   */
  critical(message: string, context: Context = {}): void {
    if (context.error instanceof Error) {
      context.error = Logger.formatError(context.error);
    }

    this.log(message, 500, 'critical', context);
  }

  /**
   * Action must be taken immediately
   *
   * Example: Entire website down, database unavailable, etc.
   * This should trigger the SMS alerts and wake you up.
   */
  alert(message: string, context: Context = {}): void {
    if (context.error instanceof Error) {
      context.error = Logger.formatError(context.error);
    }

    this.log(message, 550, 'alert', context);
  }

  /**
   * Urgent alert.
   */
  emergency(message: string, context: Context = {}): void {
    if (context.error instanceof Error) {
      context.error = Logger.formatError(context.error);
    }

    this.log(message, 600, 'emergency', context);
  }
}
