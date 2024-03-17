/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMongoDbConnection } from "../../config/connectionManager";
import { mongoDbCollectionNames } from "../../constants";
import logger from '../../utils/logger'
import {LogSchema} from "../models";

export class LoggingService {
  dbConnection: any;

  public constructor() {
    this.dbConnection = getMongoDbConnection();
  }

  public async logHandler(message: string, ack: any) {
    try {
      message = JSON.parse(message);
      try {
        await this.logToDb(message);
      } catch (error) {
        logger.error(error, '[Error]: ')
      }
      this.logMessage(message);
    } catch (error) {
      logger.error(error, '[Error]: ')
    } finally {
      ack();
    }
  }

  private logMessage(dataObj: any) {
    switch (dataObj.log_level) {
      case 'error':
        logger.error(dataObj, '[Error]: ')
        break;
      case 'warn':
        logger.warn(dataObj, '[Warning]: ')
        break;
      case 'info':
        logger.info(dataObj, '[Info]: ')
        break;
      case 'debug':
        logger.debug(dataObj, '[Debug]: ')
        break;
      default: 
        logger.info(dataObj, '[Info]: ')
        break;
    }
  }

  private async logToDb(dataObj: any) {
    const dbConn = await this.dbConnection;
    const Log = dbConn.model(mongoDbCollectionNames.logs, LogSchema);
    await new Log(dataObj).save();
  }

}
