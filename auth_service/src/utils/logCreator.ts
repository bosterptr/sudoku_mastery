import { logLevel } from 'kafkajs';
import winston, { format } from 'winston';

const myFormat = format.printf(
  ({ level, message, timestamp, namespace, label }) =>
    `${label} [${namespace}] ${level} ${timestamp}: ${message}`,
);

const toWinstonLogLevel = (level: logLevel) => {
  switch (level) {
    case logLevel.WARN:
      return 'warn';
    case logLevel.INFO:
      return 'info';
    case logLevel.DEBUG:
      return 'debug';
    case logLevel.ERROR:
    case logLevel.NOTHING:
    default:
      return 'error';
  }
};

export default (level: logLevel) => {
  const logger = winston.createLogger({
    level: toWinstonLogLevel(level),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: 'myapp.log',
        format: format.combine(format.timestamp(), myFormat),
      }),
    ],
  });

  return (obj: { level: logLevel; log: { message: string } }) => {
    const { message, ...meta } = obj.log;
    logger.log({
      level: toWinstonLogLevel(level),
      message,
      meta,
    });
  };
};
