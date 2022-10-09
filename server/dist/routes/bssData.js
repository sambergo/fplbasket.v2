"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const superagent_1 = __importDefault(require("superagent"));
const getOrSetCache_1 = require("../tools/getOrSetCache");
const FPLDATA_EXPIRATION = 60;
const redisKey_bssData = "bssdata";
const dataRouter = (0, express_1.Router)();
const fetchBssDataFromFpl = async () => {
    const bootstrap_static = await superagent_1.default.get(`https://fantasy.premierleague.com/api/bootstrap-static/`);
    const fpldata = bootstrap_static.body;
    let elements = [];
    fpldata.elements.forEach((element) => {
        elements[element.id] = element;
    });
    fpldata.elements = elements;
    const returnObject = { freshData: fpldata, ex: FPLDATA_EXPIRATION };
    return returnObject;
};
dataRouter.get("/", async (_req, res) => {
    try {
        const data = await (0, getOrSetCache_1.getOrSetCache)(redisKey_bssData, fetchBssDataFromFpl);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(404).json(err);
    }
});
module.exports = dataRouter;
//# sourceMappingURL=bssData.js.map