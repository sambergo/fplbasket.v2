"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fetchBssData_1 = require("../tools/fetchBssData");
const dataRouter = (0, express_1.Router)();
dataRouter.get("/", async (_req, res) => {
    try {
        const bssData = await (0, fetchBssData_1.fetchBssDataFromFpl)();
        res.status(200).json(bssData);
    }
    catch (err) {
        res.status(404).json(err);
    }
});
module.exports = dataRouter;
//# sourceMappingURL=bssData.js.map