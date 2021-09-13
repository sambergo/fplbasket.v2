import cors from "cors";
import express, { Request, Response } from "express";
import Redis from "redis";
import superagent from "superagent";
import { TeamsFetchType, LeagueFetchType } from "./types/LeagueFetchType";
import { DataType } from "./types/data";
import { LeagueType } from "./types/manager";
import { getParsedData } from "./tools/getParsedData";
import { getPreviousGwOrNull } from "./tools/helpers";

const app = express();
const PORT = 3636;
const FPLDATA_EXPIRATION = 60 * 60;
const LEAGUE_EXPIRATION = 60 * 60 * 712;
const redisClient = Redis.createClient();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("build"));
app.use("/id/*", express.static("build"));

interface RedisSetCacheResponse {
  freshData: any;
  ex: number;
}
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
        redisClient.setex(redisKey, ex, JSON.stringify(freshData));
        resolve(freshData);
      } catch (error) {
        reject(error);
      }
    });
  });
};

const fetchTeams = async (params: TeamsFetchType) => {
  console.log("fetchteams");
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
  console.log("fetchleague:", params);
  try {
    const league_request = await superagent.get(
      `https://fantasy.premierleague.com/api/leagues-classic/${params.leagueId}/standings/`
    );
    const league: LeagueType = league_request.body;
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

const fetchDataFromFpl = async (): Promise<RedisSetCacheResponse> => {
  console.log("fetch-data");
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

app.post("/api/league", async (req: Request, res: Response) => {
  try {
    const params: LeagueFetchType = req.body;
    const prev_gw = getPreviousGwOrNull(params.gw);
    console.log("prev_gw:", prev_gw);
    const redisKey_curr = `league:${params.leagueId}#gw:${params.gw}`;
    const redisKey_prev = `league:${params.leagueId}#gw:${prev_gw}`;
    const league_curr: LeagueType = await getOrSetCache(
      redisKey_curr,
      fetchLeague,
      params
    );
    const league_prev: LeagueType | null = !prev_gw
      ? null
      : await getOrSetCache(redisKey_prev, fetchLeague, {
          ...params,
          gw: prev_gw,
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
fuction dada {
  return 'The league is '
}
app.get("/api/data", async (_req: Request, res: Response) => {
  console.log("api-data");
  const redisKey = "bssdata";
  try {
    const data = await getOrSetCache(redisKey, fetchDataFromFpl);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json(err);
  }
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
