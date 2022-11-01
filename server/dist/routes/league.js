"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fetchBssData_1 = require("../tools/fetchBssData");
const superagent_1 = __importDefault(require("superagent"));
const Standings_1 = __importDefault(require("../models/Standings"));
const dbConnection_1 = __importDefault(require("../tools/dbConnection"));
const expirations_1 = require("../tools/expirations");
const getParsedData_1 = require("../tools/getParsedData");
const helpers_1 = require("../tools/helpers");
(0, dbConnection_1.default)();
const leagueRouter = (0, express_1.Router)();
const fetchFromUrl = async (req_url) => {
    const { body } = await superagent_1.default.get(req_url);
    return body;
};
const fetchTeams = async (params) => {
    let resultList = [];
    for (const resultObject of params.standings.results) {
        const entry = resultObject.entry.toString();
        const picks_url = `https://fantasy.premierleague.com/api/entry/${entry}/event/${params.gw}/picks/`;
        const transfers_url = `https://fantasy.premierleague.com/api/entry/${entry}/transfers/`;
        const history_url = `https://fantasy.premierleague.com/api/entry/${entry}/history/`;
        const gw_team = await fetchFromUrl(picks_url);
        const transfers = await fetchFromUrl(transfers_url);
        const history = await fetchFromUrl(history_url);
        resultList.push(Object.assign(Object.assign({}, resultObject), { gw_team,
            transfers,
            history }));
    }
    return resultList;
};
const getOrFetchLeague = async (id, params = null) => {
    const data = await Standings_1.default.findOne({ id });
    const timeNow = new Date().getTime();
    const isFreshEnough = timeNow < (data === null || data === void 0 ? void 0 : data.ex);
    if (data && isFreshEnough) {
        console.log("IS FRESH ENOUGH");
        return data;
    }
    else {
        await Standings_1.default.deleteMany({ id });
        const cbData = await fetchLeague(params);
        const ex = timeNow + 1000 * cbData.ex;
        const newObj = new Standings_1.default(Object.assign(Object.assign({}, cbData.freshData), { id,
            ex }));
        return newObj.save();
    }
};
const fetchLeague = async (params) => {
    console.log("fetch league from fpl", params);
    try {
        const league_request = await superagent_1.default.get(`https://fantasy.premierleague.com/api/leagues-classic/${params.leagueId}/standings/`);
        const league = league_request.body;
        const bssData = await (0, fetchBssData_1.fetchBssDataFromFpl)();
        const league_expiration = await (0, expirations_1.getLeagueExpiration)(bssData, parseInt(params.gw));
        const managers = await fetchTeams(Object.assign(Object.assign({}, params), { standings: league.standings }));
        const returnObject = {
            freshData: Object.assign(Object.assign({}, league), { managers }),
            ex: league_expiration,
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
        const mongoId_curr = `league:${params.leagueId}#gw:${params.gw}`;
        const mongoId_prev = `league:${params.leagueId}#gw:${prev_gw}`;
        const league_curr = await getOrFetchLeague(mongoId_curr, params);
        const league_prev = !prev_gw
            ? null
            : await getOrFetchLeague(mongoId_prev, Object.assign(Object.assign({}, params), { gw: prev_gw }));
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