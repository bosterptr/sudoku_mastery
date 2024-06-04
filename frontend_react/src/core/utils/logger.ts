export interface Logger {
  withCategory(category: string): Logger;
  withComponentName(componentName: string): Logger;
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  errorAndReport(error: Readonly<Error>, message: string, ...args: unknown[]): void;
}
