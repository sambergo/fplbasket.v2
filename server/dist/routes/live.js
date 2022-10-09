"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const superagent_1 = __importDefault(require("superagent"));
const getOrSetCache_1 = require("../tools/getOrSetCache");
const getParsedLive_1 = require("../tools/getParsedLive");
const LIVE_ELEMENTS_EXPIRATION = 10;
const liveRouter = (0, express_1.Router)();
const fetchLiveElements = async (params) => {
    const event_live = await superagent_1.default.get(`https://fantasy.premierleague.com/api/event/${params.gw}/live/`);
    const fixtures_req = await superagent_1.default.get(`https://fantasy.premierleague.com/api/fixtures/?event=${params.gw}`);
    const livedata = event_live.body;
    const fixtures_body = fixtures_req.body;
    const elements = [];
    const fixtures = [];
    livedata.elements.forEach((element) => (elements[element.id] = element));
    fixtures_body.forEach((fixture) => (fixtures[fixture.id] = fixture));
    const returnObject = {
        freshData: { elements: (0, getParsedLive_1.getParsedLive)(elements, fixtures), fixtures },
        ex: LIVE_ELEMENTS_EXPIRATION,
    };
    return returnObject;
};
liveRouter.post("/", async (req, res) => {
    try {
        const params = req.body;
        const redisKey_live = `liveElements#GW:${params.gw}`;
        const liveElements = await (0, getOrSetCache_1.getOrSetCache)(redisKey_live, fetchLiveElements, params);
        res.status(200).json(liveElements);
    }
    catch (err) {
        res.status(404).json(err);
    }
});
module.exports = liveRouter;
//# sourceMappingURL=live.js.map