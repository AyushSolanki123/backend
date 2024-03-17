"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const path_1 = __importDefault(require("path"));
const winston_1 = __importDefault(require("winston"));
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
winston_1.default.addColors(logColors);
// Create Winston Formatter
const formatter = winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), winston_1.default.format.label({ label: `${path_1.default.basename(((_a = process === null || process === void 0 ? void 0 : process.mainModule) === null || _a === void 0 ? void 0 : _a.filename) || '')}` }), winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf((({ level, label, message, timestamp }) => `${timestamp} pid: ${process.pid} ${level} [${label}]: ${message}`)), winston_1.default.format.json());
// Create console transport
const consoleTransport = new winston_1.default.transports.Console({
    format: formatter,
});
// Create logger instance
const _logger = winston_1.default.createLogger({
    levels: logLevels,
    format: formatter,
    transports: [consoleTransport],
});
// Format Data Object
const formatData = (data, level) => {
    data.log_level = level;
    data = JSON.stringify(data);
    return data;
};
// Export functions to log based on log levels
const error = (dataObj, message) => {
    dataObj = dataObj || {};
    const msg = Object.keys(dataObj).length > 0 ? `${message} | data:  ${formatData(dataObj, 'error')}` : message;
    _logger.error(msg);
};
const warn = (dataObj, message) => {
    dataObj = dataObj || {};
    const msg = Object.keys(dataObj).length > 0 ? `${message} | data:  ${formatData(dataObj, 'warn')}` : message;
    _logger.warn(msg);
};
const info = (dataObj, message) => {
    dataObj = dataObj || {};
    const msg = Object.keys(dataObj).length > 0 ? `${message} | data:  ${formatData(dataObj, 'info')}` : message;
    _logger.info(msg);
};
const debug = (dataObj, message) => {
    dataObj = dataObj || {};
    const msg = Object.keys(dataObj).length > 0 ? `${message} | data:  ${formatData(dataObj, 'debug')}` : message;
    _logger.debug(msg);
};
exports.default = {
    error,
    warn,
    info,
    debug,
};
