"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getParsedLive_1 = require("../tools/getParsedLive");
const liveRouter = (0, express_1.Router)();
const fetchLiveElements = async ({ gw }) => {
    try {
        const [event_live, fixtures_req] = await Promise.all([
            fetch(`https://fantasy.premierleague.com/api/event/${gw}/live/`),
            fetch(`https://fantasy.premierleague.com/api/fixtures/?event=${gw}`),
        ]);
        const livedata = await event_live.json();
        const fixtures_body = await fixtures_req.json();
        const elements = [];
        const fixtures = [];
        livedata.elements.forEach((element, _index) => (elements[element.id] = element));
        fixtures_body.forEach((fixture, _index) => (fixtures[fixture.id] = fixture));
        return { elements: (0, getParsedLive_1.getParsedLive)(elements, fixtures), fixtures };
    }
    catch (err) {
        throw err;
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