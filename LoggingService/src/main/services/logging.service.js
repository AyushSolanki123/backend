"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const connectionManager_1 = require("../../config/connectionManager");
const constants_1 = require("../../constants");
const logger_1 = __importDefault(require("../../utils/logger"));
const models_1 = require("../models");
class LoggingService {
    constructor() {
        this.dbConnection = (0, connectionManager_1.getMongoDbConnection)();
    }
    logHandler(message, ack) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                message = JSON.parse(message);
                try {
                    yield this.logToDb(message);
                }
                catch (error) {
                    logger_1.default.error(error, '[Error]: ');
                }
                this.logMessage(message);
            }
            catch (error) {
                logger_1.default.error(error, '[Error]: ');
            }
            finally {
                ack();
            }
        });
    }
    logMessage(dataObj) {
        switch (dataObj.log_level) {
            case 'error':
                logger_1.default.error(dataObj, '[Error]: ');
                break;
            case 'warn':
                logger_1.default.warn(dataObj, '[Warning]: ');
                break;
            case 'info':
                logger_1.default.info(dataObj, '[Info]: ');
                break;
            case 'debug':
                logger_1.default.debug(dataObj, '[Debug]: ');
                break;
            default:
                logger_1.default.info(dataObj, '[Info]: ');
                break;
        }
    }
    logToDb(dataObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbConn = yield this.dbConnection;
            const Log = dbConn.model(constants_1.mongoDbCollectionNames.logs, models_1.LogSchema);
            yield new Log(dataObj).save();
        });
    }
}
exports.LoggingService = LoggingService;
