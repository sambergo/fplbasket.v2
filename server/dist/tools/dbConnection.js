"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGO_URI || "";
const dbName = "fplbasket";
async function dbConnect() {
    if (mongoose_1.default.connection.readyState >= 1) {
        return;
    }
    return mongoose_1.default.connect(MONGO_URI + dbName);
}
exports.default = dbConnect;
//# sourceMappingURL=dbConnection.js.map