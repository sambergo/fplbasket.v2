"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const redis_1 = __importDefault(require("redis"));
const superagent_1 = __importDefault(require("superagent"));
const expirations_1 = require("./tools/expirations");
const getParsedData_1 = require("./tools/getParsedData");
const helpers_1 = require("./tools/helpers");
require("dotenv").config();
const main = async () => {
    const app = express_1.default();
    const PORT = process.env.PORT;
    const MONGO_URI = process.env.MONGO_URI || "";
    const dbName = "fplbasket";
    const FPLDATA_EXPIRATION = 60;
    const LIVE_ELEMENTS_EXPIRATION = 10;
    const redisClient = redis_1.default.createClient();
    const redisKey_bssData = "bssdata";
    app.use(cors_1.default());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.use(express_1.default.static("build"));
    app.use("/id/*", express_1.default.static("build"));
    const mongoClient = new mongodb_1.MongoClient(MONGO_URI);
    await mongoClient.connect();
    const db = mongoClient.db(dbName);
    const leagues = db.collection("leagues");
    const getOrFetchLeague = async (id, cb, params = null) => {
        const data = await leagues.findOne({ id });
        const timeNow = new Date().getTime();
        if (data && timeNow < data.ex)
            return data;
        else {
            const cbData = await cb(params);
            const ex = timeNow + 1000 * cbData.ex;
            const newObj = Object.assign(Object.assign({}, cbData.freshData), { id,
                ex });
            await leagues.insertOne(newObj);
            return newObj;
        }
    };
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
        try {
            const league_request = await superagent_1.default.get(`https://fantasy.premierleague.com/api/leagues-classic/${params.leagueId}/standings/`);
            const league = league_request.body;
            const bssData = await getOrSetCache(redisKey_bssData, fetchBssDataFromFpl);
            const LEAGUE_EXPIRATION = await expirations_1.getLeagueExpiration(bssData, parseInt(params.gw));
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
    const fetchLiveElements = async (params) => {
        const bootstrap_static = await superagent_1.default.get(`https://fantasy.premierleague.com/api/event/${params.gw}/live/`);
        const livedata = bootstrap_static.body;
        const elements = [];
        livedata.elements.forEach((element) => (elements[element.id] = element));
        const returnObject = { freshData: elements, ex: LIVE_ELEMENTS_EXPIRATION };
        return returnObject;
    };
    app.post("/api/league", async (req, res) => {
        try {
            const params = req.body;
            const prev_gw = helpers_1.getPreviousGwOrNull(params.gw);
            console.log(`${params.leagueId} haettu gw ${params.gw}. ${new Date()}`);
            const mongoId_curr = `league:${params.leagueId}#gw:${params.gw}`;
            const mongoId_prev = `league:${params.leagueId}#gw:${prev_gw}`;
            const league_curr = await getOrFetchLeague(mongoId_curr, fetchLeague, params);
            const league_prev = !prev_gw
                ? null
                : await getOrFetchLeague(mongoId_prev, fetchLeague, Object.assign(Object.assign({}, params), { gw: prev_gw }));
            const parsedData = getParsedData_1.getParsedData({ league_curr, league_prev });
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
    app.post("/api/live", async (req, res) => {
        try {
            const params = req.body;
            const redisKey_live = `liveElements#GW:${params.gw}`;
            const liveElements = await getOrSetCache(redisKey_live, fetchLiveElements, params);
            res.status(200).json(liveElements);
        }
        catch (err) {
            res.status(404).json(err);
        }
    });
    app.get("/api/data", async (_req, res) => {
        try {
            const data = await getOrSetCache(redisKey_bssData, fetchBssDataFromFpl);
            res.status(200).json(data);
        }
        catch (err) {
            res.status(404).json(err);
        }
    });
    app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at PORT: ${PORT}`);
    });
};
main().catch((err) => {
    console.error(err);
});
//# sourceMappingURL=server.js.map