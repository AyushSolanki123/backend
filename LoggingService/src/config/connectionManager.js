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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoDbConnection = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_prefix = (_a = process.env.MONGODB_PREFIX) !== null && _a !== void 0 ? _a : 'mongodb';
const mongodb_user = (_b = process.env.MONGODB_USER) !== null && _b !== void 0 ? _b : 'admin';
const mongodb_password = (_c = process.env.MONGODB_PASSWORD) !== null && _c !== void 0 ? _c : 'passoword';
const mongodb_host = (_d = process.env.MONGODB_HOST) !== null && _d !== void 0 ? _d : 'localhost';
const mongodb_port = (_e = process.env.MONGODB_PORT) !== null && _e !== void 0 ? _e : '27017';
const mongodb_db = (_f = process.env.MONGODB_DB) !== null && _f !== void 0 ? _f : 'Chatify';
const nosqlConfig = {
    prefix: mongodb_prefix,
    user: mongodb_user,
    password: mongodb_password,
    host: mongodb_host,
    port: mongodb_port,
    db: mongodb_db
};
const getMongoDbConnectionString = () => {
    const { prefix, user, password, host, port, db } = nosqlConfig;
    return prefix === 'mongodb' ? `${prefix}://${user}:${password}@${host}:${port}/${db}` : `${prefix}://${user}:${password}@${host}/${db}`;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMongoDbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    const mongodbUri = getMongoDbConnectionString();
    try {
        return mongoose_1.default.createConnection(mongodbUri);
    }
    catch (error) {
        return error;
    }
});
exports.getMongoDbConnection = getMongoDbConnection;
