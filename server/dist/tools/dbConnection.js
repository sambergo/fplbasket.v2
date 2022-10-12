"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGO_URI || "";
console.log("MONGO_URI:", MONGO_URI);
async function dbConnect() {
    if (mongoose_1.default.connection.readyState >= 1) {
        console.log("mongoose connection", mongoose_1.default.connection.readyState);
        return;
    }
    return mongoose_1.default.connect(MONGO_URI);
}
exports.default = dbConnect;
//# sourceMappingURL=dbConnection.js.map