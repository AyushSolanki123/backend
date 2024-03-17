"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQWrapper = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const amqp = __importStar(require("amqplib"));
class RabbitMQWrapper {
    constructor(connectionURI) {
        this.connectionURI = (connectionURI === null || connectionURI === void 0 ? void 0 : connectionURI.length) > 0 ? connectionURI : 'amqp://localhost:5672';
    }
    executOnce(fn) {
        let executed = false;
        return () => {
            if (!executed) {
                executed = true;
                fn();
            }
        };
    }
    createChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.channel = yield ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.createChannel());
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = yield amqp.connect(this.connectionURI);
            yield this.createChannel();
        });
    }
    unsubscribe(handler) {
        this.handlers = this.handlers.filter((h) => h !== handler);
    }
    send(queue, message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!this.connection) {
                yield this.connect();
            }
            if (!this.queue) {
                this.queue = queue;
            }
            const buffer = Buffer.from(JSON.stringify(message));
            yield ((_a = this.channel) === null || _a === void 0 ? void 0 : _a.assertQueue(this.queue, { durable: true }));
            (_b = this.channel) === null || _b === void 0 ? void 0 : _b.sendToQueue(this.queue, buffer);
        });
    }
    subscribe(queue, handler) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!this.connection) {
                yield this.connect();
            }
            if (!this.queue) {
                this.queue = queue;
            }
            else {
                const existingHandler = this.handlers.find((h) => h === handler);
                if (existingHandler) {
                    return () => { this.unsubscribe(existingHandler); };
                }
            }
            this.handlers.push(handler);
            yield ((_a = this.channel) === null || _a === void 0 ? void 0 : _a.assertQueue(this.queue, { durable: true }));
            (_b = this.channel) === null || _b === void 0 ? void 0 : _b.consume(this.queue, (message) => __awaiter(this, void 0, void 0, function* () {
                if (message) {
                    const ack = this.executOnce(() => { var _a; return (_a = this.channel) === null || _a === void 0 ? void 0 : _a.ack(message); });
                    this.handlers.forEach((h) => { h(JSON.parse(message.content.toString()), ack); });
                }
            }));
            return () => { this.unsubscribe(handler); };
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            yield ((_a = this.channel) === null || _a === void 0 ? void 0 : _a.close());
            yield ((_b = this.connection) === null || _b === void 0 ? void 0 : _b.close());
        });
    }
}
exports.RabbitMQWrapper = RabbitMQWrapper;
