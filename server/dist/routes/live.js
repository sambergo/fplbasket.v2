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
        console.log(1);
        livedata.elements.forEach((element, _index) => (elements[element.id] = element));
        fixtures_body.forEach((fixture, _index) => (fixtures[fixture.id] = fixture));
        console.log(2);
        const parsedElements = (0, getParsedLive_1.getParsedLive)(elements, fixtures);
        console.log("done");
        return { elements: parsedElements, fixtures };
    }
    catch (err) {
        throw err;
    }
};
liveRouter.post("/", async (req, res) => {
    try {
        const params = req.body;
        console.log("live", params);
        const liveElements = await fetchLiveElements(params);
        res.status(200).json(liveElements);
    }
    catch (err) {
        res.status(404).json(err);
    }
});
module.exports = liveRouter;
//# sourceMappingURL=live.js.map