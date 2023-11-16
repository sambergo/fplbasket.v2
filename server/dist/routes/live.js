"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getParsedLive_1 = require("../tools/getParsedLive");
const liveRouter = (0, express_1.Router)();
const fetchLiveElements = async (params) => {
    try {
        const event_live = await fetch(`https://fantasy.premierleague.com/api/event/${params.gw}/live/`);
        const fixtures_req = await fetch(`https://fantasy.premierleague.com/api/fixtures/?event=${params.gw}`);
        const livedata = await event_live.json();
        const fixtures_body = await fixtures_req.json();
        const elements = [];
        const fixtures = [];
        livedata.elements.forEach((element) => (elements[element.id] = element));
        fixtures_body.forEach((fixture) => (fixtures[fixture.id] = fixture));
        return { elements: (0, getParsedLive_1.getParsedLive)(elements, fixtures), fixtures };
    }
    catch (error) {
        console.error(error);
        throw new Error(error);
    }
};
liveRouter.post("/", async (req, res) => {
    try {
        console.log("live");
        const params = req.body;
        const liveElements = await fetchLiveElements(params);
        res.status(200).json(liveElements);
    }
    catch (err) {
        res.status(404).json(err);
    }
});
module.exports = liveRouter;
//# sourceMappingURL=live.js.map