"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = __importDefault(require("redis"));
exports.redisClient = redis_1.default.createClient();
//# sourceMappingURL=redisConnection.js.map