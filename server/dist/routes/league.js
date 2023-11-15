"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getParsedData_1 = require("../tools/getParsedData");
const helpers_1 = require("../tools/helpers");
const leagueRouter = (0, express_1.Router)();
const fetchFromUrl = async (req_url) => {
    const res = await fetch(req_url);
    const body = await res.json();
    return body;
};
const fetchTeams = async (params) => {
    let tasks = params.standings.results.map(async (resultObject) => {
        const entry = resultObject.entry.toString();
        const picks_url = `https://fantasy.premierleague.com/api/entry/${entry}/event/${params.gw}/picks/`;
        const transfers_url = `https://fantasy.premierleague.com/api/entry/${entry}/transfers/`;
        const history_url = `https://fantasy.premierleague.com/api/entry/${entry}/history/`;
        const [gw_team, transfers, history] = await Promise.all([
            fetchFromUrl(picks_url),
            fetchFromUrl(transfers_url),
            fetchFromUrl(history_url),
        ]);
        return Object.assign(Object.assign({}, resultObject), { gw_team,
            transfers,
            history });
    });
    return Promise.all(tasks);
};
const getOrFetchLeague = async (params = null) => {
    console.log("getorfetchleague");
    const cbData = await fetchLeague(params);
    return cbData.freshData;
};
const fetchLeague = async (params) => {
    console.log("fetch league from fpl", params);
    try {
        console.log("fetchleague");
        const league_request = await fetch(`https://fantasy.premierleague.com/api/leagues-classic/${params.leagueId}/standings/`);
        const league = await league_request.json();
        const managers = await fetchTeams(Object.assign(Object.assign({}, params), { standings: league.standings }));
        const returnObject = {
            freshData: Object.assign(Object.assign({}, league), { managers }),
        };
        return returnObject;
    }
    catch (err) {
        console.log("err : ", err);
        return err;
    }
};
leagueRouter.post("/", async (req, res) => {
    try {
        const params = req.body;
        const prev_gw = (0, helpers_1.getPreviousGwOrNull)(params.gw);
        console.log(`${params.leagueId} haettu gw ${params.gw}. ${new Date()}`);
        const league_curr = await getOrFetchLeague(params);
        const league_prev = !prev_gw
            ? null
            : await getOrFetchLeague(Object.assign(Object.assign({}, params), { gw: prev_gw }));
        const parsedData = (0, getParsedData_1.getParsedData)({ league_curr, league_prev });
        const returnObj = {
            league_curr,
            league_prev,
            parsedData,
        };
        res.status(200).json(returnObj);
    }
    catch (err) {
        res.status(404).json({ error: "league not found with id" });
    }
});
module.exports = leagueRouter;
//# sourceMappingURL=league.js.map