"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = require("express");
const getParsedLive_1 = require("../tools/getParsedLive");
const liveRouter = (0, express_1.Router)();
const fetchLiveElements = async ({ gw }) => {
    try {
        const [{ data: livedata }, { data: fixtures_body }] = await Promise.all([
            axios_1.default.get(`https://fantasy.premierleague.com/api/event/${gw}/live/`, {
                timeout: 10000
            }),
            axios_1.default.get(`https://fantasy.premierleague.com/api/fixtures/?event=${gw}`, {
                timeout: 10000
            }),
        ]);
        const elements = [];
        const fixtures = [];
        console.log(1);
        livedata.elements.forEach((element, _index) => (elements[element.id] = element));
        fixtures_body.forEach((fixture, _index) => (fixtures[fixture.id] = fixture));
        console.log(2);
        const parsedElements = (0, getParsedLive_1.getParsedLive)(elements, fixtures);
        console.log("done");
        return { elements: parsedElements, fixtures };
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out after 10 seconds');
            }
            throw new Error(error.message);
        }
        throw error;
    }
};
liveRouter.post("/", async (req, res) => {
    var _a, _b;
    try {
        const params = req.body;
        console.log("live", params);
        const liveElements = await fetchLiveElements(params);
        res.status(200).json(liveElements);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            res.status(((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500).json({
                message: error.message,
                error: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message
            });
        }
        else {
            res.status(500).json({
                message: 'Internal server error',
                error: error.message
            });
        }
    }
});
module.exports = liveRouter;
//# sourceMappingURL=live.js.map