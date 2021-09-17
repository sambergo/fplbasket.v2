"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const redis_1 = __importDefault(require("redis"));
const superagent_1 = __importDefault(require("superagent"));
const getParsedData_1 = require("./tools/getParsedData");
const helpers_1 = require("./tools/helpers");
const expirations_1 = require("./tools/expirations");
require("dotenv").config();
const app = (0, express_1.default)();
const PORT = 3636;
const FPLDATA_EXPIRATION = 1 * 60;
const redisClient = redis_1.default.createClient();
const redisKey_bssData = "bssdata";
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.static("build"));
app.use("/id/*", express_1.default.static("build"));
const getOrSetCache = async (redisKey, cb, params = null) => {
    return new Promise((resolve, reject) => {
        redisClient.get(redisKey, async (error, data) => {
            if (error)
                return reject(error);
            if (data)
                return resolve(JSON.parse(data));
            try {
                const { freshData, ex } = await cb(params);
                if (freshData && ex)
                    redisClient.setex(redisKey, parseInt(ex), JSON.stringify(freshData));
                resolve(freshData);
            }
            catch (error) {
                reject(error);
            }
        });
    });
};
const fetchTeams = async (params) => {
    console.log("fetchteams");
    let resultList = [];
    for (const resultObject of params.standings.results) {
        const req_url = `https://fantasy.premierleague.com/api/entry/${resultObject.entry.toString()}/event/${params.gw}/picks/`;
        const manager_request = await superagent_1.default.get(req_url);
        const gw_team = manager_request.body;
        resultList.push(Object.assign(Object.assign({}, resultObject), { gw_team }));
    }
    return resultList;
};
const fetchLeague = async (params) => {
    console.log("fetchleague:", params);
    try {
        const league_request = await superagent_1.default.get(`https://fantasy.premierleague.com/api/leagues-classic/${params.leagueId}/standings/`);
        const league = league_request.body;
        const bssData = await getOrSetCache(redisKey_bssData, fetchBssDataFromFpl);
        const LEAGUE_EXPIRATION = await (0, expirations_1.getLeagueExpiration)(bssData, parseInt(params.gw));
        console.log("LOOPU EXPI", LEAGUE_EXPIRATION);
        const managers = await fetchTeams(Object.assign(Object.assign({}, params), { standings: league.standings }));
        const returnObject = {
            freshData: Object.assign(Object.assign({}, league), { managers }),
            ex: LEAGUE_EXPIRATION,
        };
        return returnObject;
    }
    catch (err) {
        console.log("err : ", err);
        return err;
    }
};
const fetchBssDataFromFpl = async () => {
    console.log("fetch-data");
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
app.post("/api/league", async (req, res) => {
    try {
        const params = req.body;
        const prev_gw = (0, helpers_1.getPreviousGwOrNull)(params.gw);
        console.log("prev_gw:", prev_gw);
        const redisKey_curr = `league:${params.leagueId}#gw:${params.gw}`;
        const redisKey_prev = `league:${params.leagueId}#gw:${prev_gw}`;
        const league_curr = await getOrSetCache(redisKey_curr, fetchLeague, params);
        const league_prev = !prev_gw
            ? null
            : await getOrSetCache(redisKey_prev, fetchLeague, Object.assign(Object.assign({}, params), { gw: prev_gw }));
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
app.get("/api/data", async (_req, res) => {
    console.log("api-data");
    try {
        const data = await getOrSetCache(redisKey_bssData, fetchBssDataFromFpl);
        res.status(200).json(data);
    }
    catch (err) {
        res.status(404).json(err);
    }
});
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map