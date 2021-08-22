type LogLevel = (100|200|250|300|400|500);
type Context = {[key: string]: (string|number|Error)};

export default class {
  private static getLocation(): (string|null) {
    return (new Error()).stack?.split('\n')[4].trim() || null;
  }

  private static formatError(error: Error): {message: string, name: string, location: string} {
    return {
      message: error.message,
      name: error.name,
      location: error.stack?.split('\n')[4].trim() || 'Unknown',
    };
  }

  private static log(message: string, context: Context, logLevel: LogLevel): void {
    if (context.error instanceof Error) {
      context.error = this.formatError(context.error);
    }

    console.log(JSON.stringify({
      message,
      context,
      logLevel,
      location: this.getLocation(),
      timestamp: (new Date).toUTCString(),
    }));
  }

  static debug(message: string, context = {}): void {
    if (process.env.NODE_ENV === 'testing') {
      this.log(message, context, 100);
    }
  }

  static info(message: string, context = {}): void {
    this.log(message, context, 200);
  }

  static notice(message: string, context = {}): void {
    this.log(message, context, 250);
  }

  static warning(message: string, context = {}): void {
    this.log(message, context, 300);
  }

  static error(message: string, context = {}): void {
    this.log(message, context, 400);
  }

  static critical(message: string, context = {}): void {
    this.log(message, context, 500);
  }
}
