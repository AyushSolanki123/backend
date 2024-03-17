"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogSchema = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../../constants");
const { ObjectId } = mongoose_1.Types;
exports.LogSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        required: true,
        default: new ObjectId().toString()
    },
    level: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    collection: constants_1.mongoDbCollectionNames.logs
});
