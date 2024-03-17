"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const rabbitmq_wrapper_1 = require("./utils/rabbitmq-wrapper");
const logging_service_1 = require("./main/services/logging.service");
dotenv_1.default.config();
const LOGGING_QUEUE = (_a = process.env.LOGGING_QUEUE) !== null && _a !== void 0 ? _a : 'LOGGING_QUEUE';
const RABBIT_MQ_URI = (_b = process.env.RABBITMQ_URI) !== null && _b !== void 0 ? _b : 'amqp://localhost:5672';
const PORT = (_c = process.env.PORT) !== null && _c !== void 0 ? _c : 3000;
const rabbitMQWrapper = new rabbitmq_wrapper_1.RabbitMQWrapper(RABBIT_MQ_URI);
const loggingService = new logging_service_1.LoggingService();
rabbitMQWrapper.subscribe(LOGGING_QUEUE, loggingService.logHandler);
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
