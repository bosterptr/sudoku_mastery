import { createLogger, format, transports } from 'winston';
import { kafkaClientName } from '../mq/kafkaClient';

let logLevel;
let silent;
switch (process.env.NODE_ENV) {
  case 'production':
    logLevel = 'info';
    silent = false;
    break;
  case 'test':
    logLevel = 'emerg';
    silent = true;
    break;
  default:
    logLevel = 'debug';
    silent = false;
    break;
}

const winstonOptions = {
  level: logLevel,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: kafkaClientName },
  transports: [new transports.Console()],
};

const logger = createLogger(winstonOptions);

if (process.env.NODE_ENV === 'development') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
      handleExceptions: true,
      silent,
    }),
  );
}

export default logger;
