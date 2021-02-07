import * as winston from 'winston'
import {Logger} from "winston";

/**
 * Create a logger instance to write log messages in JSON format.
 *
 * @param loggerName - a name of a logger that will be added to all messages
 */
 export const getLogger = function() {
  let logger: Logger;
  return () => {
    if (!logger) {
      logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
          new winston.transports.Console()
        ],
      });
    }
    return logger;
  }
}();