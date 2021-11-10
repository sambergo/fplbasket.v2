import cors from "cors";
import express, { Request, Response } from "express";
import Redis from "redis";
import superagent from "superagent";
import {
  TeamsFetchType,
  LeagueFetchType,
  LiveFetchType,
} from "./types/LeagueFetchType";
import { DataType } from "./types/data";
import { LeagueType } from "./types/manager";
import { getParsedData } from "./tools/getParsedData";
import { getPreviousGwOrNull } from "./tools/helpers";
import { getLeagueExpiration } from "./tools/expirations";
import { RootLiveElements } from "./types/liveElements";
require("dotenv").config();
import { MongoClient } from "mongodb";

const main = async () => {
  const app = express();
  const PORT = process.env.PORT;
  const MONGO_URI = process.env.MONGO_URI || "";
  const dbName = "fplbasketdev";
  const FPLDATA_EXPIRATION = 60;
  const LIVE_ELEMENTS_EXPIRATION = 10;
  const redisClient = Redis.createClient();
  const redisKey_bssData = "bssdata";
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static("build"));
  app.use("/id/*", express.static("build"));

  interface RedisSetCacheResponse {
    freshData: any;
    ex: number;
  }

  const mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  const db = mongoClient.db(dbName);
  const collection = db.collection("leagues");

  const getOrSetMongo = async (
    id: string,
    cb: Function,
    params: any = null
  ): Promise<any> => {
    const data = await collection.findOne({ id });
    if (data) return data;
    else {
      const freshData = await cb(params);
      console.log(freshData.ex);
      const newObj = {
        ...freshData.freshData,
        id,
      };
      await collection.insertOne(newObj);
      return newObj;
    }
  };

  // TODO virheenhallinta jos redis ei toimi
  const getOrSetCache = async (
    redisKey: string,
    cb: Function,
    params: any = null
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      redisClient.get(redisKey, async (error, data) => {
        if (error) return reject(error);
        if (data) return resolve(JSON.parse(data));
        try {
          const { freshData, ex } = await cb(params);
          if (freshData && ex)
            redisClient.setex(
              redisKey,
              parseInt(ex),
              JSON.stringify(freshData)
            );
          resolve(freshData);
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  const fetchTeams = async (params: TeamsFetchType) => {
    let resultList = [];
    for (const resultObject of params.standings.results) {
      const req_url = `https://fantasy.premierleague.com/api/entry/${resultObject.entry.toString()}/event/${
        params.gw
      }/picks/`;
      const manager_request = await superagent.get(req_url);
      const gw_team = manager_request.body;
      resultList.push({
        ...resultObject,
        gw_team,
      });
    }
    return resultList;
  };

  const fetchLeague = async (
    params: LeagueFetchType
  ): Promise<RedisSetCacheResponse> => {
    try {
      const league_request = await superagent.get(
        `https://fantasy.premierleague.com/api/leagues-classic/${params.leagueId}/standings/`
      );
      const league: LeagueType = league_request.body;
      const bssData: DataType = await getOrSetCache(
        redisKey_bssData,
        fetchBssDataFromFpl
      );
      const LEAGUE_EXPIRATION = await getLeagueExpiration(
        bssData,
        parseInt(params.gw)
      );
      const managers = await fetchTeams({
        ...params,
        standings: league.standings,
      });
      const returnObject = {
        freshData: { ...league, managers },
        ex: LEAGUE_EXPIRATION,
      };
      return returnObject;
    } catch (err) {
      console.log("err : ", err);
      return err;
    }
  };

  const fetchBssDataFromFpl = async (): Promise<RedisSetCacheResponse> => {
    const bootstrap_static = await superagent.get(
      `https://fantasy.premierleague.com/api/bootstrap-static/`
    );
    const fpldata: DataType = bootstrap_static.body;
    // Järjestää elementit id mukaan, joka on tarpeen frontissa
    let elements: DataType["elements"] = [];
    fpldata.elements.forEach((element) => {
      elements[element.id] = element;
    });
    fpldata.elements = elements;
    const returnObject = { freshData: fpldata, ex: FPLDATA_EXPIRATION };
    return returnObject;
  };

  const fetchLiveElements = async (
    params: LiveFetchType
  ): Promise<RedisSetCacheResponse> => {
    const bootstrap_static = await superagent.get(
      `https://fantasy.premierleague.com/api/event/${params.gw}/live/`
    );
    const livedata: RootLiveElements = bootstrap_static.body;
    const elements: RootLiveElements["elements"] = [];
    livedata.elements.forEach((element) => (elements[element.id] = element));
    const returnObject = { freshData: elements, ex: LIVE_ELEMENTS_EXPIRATION };
    return returnObject;
  };

  app.post("/api/league", async (req: Request, res: Response) => {
    try {
      const params: LeagueFetchType = req.body;
      const prev_gw = getPreviousGwOrNull(params.gw);
      console.log(`${params.leagueId} haettu gw ${params.gw}. ${new Date()}`);
      const redisKey_curr = `league:${params.leagueId}#gw:${params.gw}`;
      const redisKey_prev = `league:${params.leagueId}#gw:${prev_gw}`;
      const league_curr: LeagueType = await getOrSetMongo(
        redisKey_curr,
        fetchLeague,
        params
      );
      const league_prev: LeagueType | null = !prev_gw
        ? null
        : await getOrSetMongo(redisKey_prev, fetchLeague, {
            ...params,
          });
      const parsedData = getParsedData({ league_curr, league_prev });
      const returnObj = {
        league_curr,
        league_prev,
        parsedData,
      };
      res.status(200).json(returnObj);
    } catch (err) {
      res.status(404).json({ error: "league not found with id" });
    }
  });

  app.post("/api/live", async (req: Request, res: Response) => {
    try {
      const params: LiveFetchType = req.body;
      const redisKey_live = `liveElements#GW:${params.gw}`;
      const liveElements = await getOrSetCache(
        redisKey_live,
        fetchLiveElements,
        params
      );
      res.status(200).json(liveElements);
    } catch (err) {
      res.status(404).json(err);
    }
  });

  app.get("/api/data", async (_req: Request, res: Response) => {
    try {
      const data = await getOrSetCache(redisKey_bssData, fetchBssDataFromFpl);
      res.status(200).json(data);
    } catch (err) {
      res.status(404).json(err);
    }
  });

  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
