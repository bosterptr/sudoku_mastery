import { Logger } from './logger';

/* eslint-disable no-console */
export class PassthruLogger {
  public withCategory(): Logger {
    return this;
  }

  public withComponentName(): Logger {
    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  public debug(message?: unknown) {
    console.debug(message);
  }

  // eslint-disable-next-line class-methods-use-this
  public info(message?: unknown) {
    console.log(message);
  }

  // eslint-disable-next-line class-methods-use-this
  public warn(message?: unknown) {
    console.warn(message);
  }

  // eslint-disable-next-line class-methods-use-this
  public errorAndReport(error: Error, message: string) {
    // console.error(error, message);
    // console.log(error, message);
    // eslint-disable-next-line no-unused-expressions
    error.message === message;
  }
}
