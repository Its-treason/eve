'use strict';

module.exports = class {
  /**
   * @private
   * @internal
   */
  static getLocation() {
    return (new Error()).stack.split('\n')[4].trim();
  }

  /**
   * @private
   * @internal
   * @param error {Error}
   * @returns {{name, message}}
   */
  static formatError(error) {
    return {
      message: error.message,
      name: error.name,
    };
  }

  /**
   * @private
   * @internal
   */
  static log(message, context, logLevel) {
    if (context.error) {
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

  static debug(message, context = {}) {
    if (process.env.NODE_ENV === 'testing') {
      this.log(message, context, 100);
    }
  }

  static info(message, context = {}) {
    this.log(message, context, 200);
  }

  static notice(message, context = {}) {
    this.log(message, context, 250);
  }

  static warning(message, context = {}) {
    this.log(message, context, 300);
  }

  static error(message, context = {}) {
    this.log(message, context, 400);
  }

  static critical(message, context = {}) {
    this.log(message, context, 500);
  }
};
