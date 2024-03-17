/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import winston from 'winston';

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Define log colors
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

// Add colors to log levels
winston.addColors(logColors);

// Create Winston Formatter
const formatter = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.label({ label: `${path.basename(process?.mainModule?.filename || '')}` }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (({ level, label, message, timestamp }) =>
      `${timestamp} pid: ${process.pid} ${level} [${label}]: ${message}`
  )),
  winston.format.json()
);

// Create console transport
const consoleTransport = new winston.transports.Console({
  format: formatter,
});

// Create logger instance
const _logger = winston.createLogger({
  levels: logLevels,
  format: formatter,
  transports: [consoleTransport],
});

// Format Data Object
const formatData = (data: any, level: string): string => {
  data.log_level = level;
  data = JSON.stringify(data);
  return data;  
};

// Export functions to log based on log levels
const error = (dataObj: any, message: string) => {
  dataObj = dataObj || {};
 const msg = Object.keys(dataObj).length > 0 ? `${message} | data:  ${formatData(dataObj, 'error')}` : message;
  _logger.error(msg);
}

const warn = (dataObj: any, message: string) => {
  dataObj = dataObj || {};
 const msg = Object.keys(dataObj).length > 0 ? `${message} | data:  ${formatData(dataObj, 'warn')}` : message;
  _logger.warn(msg);
}

const info = (dataObj: any, message: string) => {
  dataObj = dataObj || {};
 const msg = Object.keys(dataObj).length > 0 ? `${message} | data:  ${formatData(dataObj, 'info')}` : message;
  _logger.info(msg);
}

const debug = (dataObj: any, message: string) => {
  dataObj = dataObj || {};
 const msg = Object.keys(dataObj).length > 0 ? `${message} | data:  ${formatData(dataObj, 'debug')}` : message;
  _logger.debug(msg);
}

export default {
  error,
  warn,
  info,
  debug,
};