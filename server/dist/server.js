"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const main = async () => {
    const app = (0, express_1.default)();
    const PORT = process.env.PORT;
    app.use((0, cors_1.default)());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.use(express_1.default.static("build"));
    app.use("/id/*", express_1.default.static("build"));
    app.use("/api/data", require("./routes/bssData"));
    app.use("/api/league", require("./routes/league"));
    app.use("/api/live", require("./routes/live"));
    app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at PORT: ${PORT}`);
    });
};
main().catch((err) => {
    console.error(err);
});
//# sourceMappingURL=server.js.map