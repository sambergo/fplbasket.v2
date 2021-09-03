import cors from "cors";
import express, { Request, Response } from "express";
import Redis from "redis";
import superagent from "superagent";
import { TeamsFetchType, LeagueFetchType } from "./types/LeagueFetchType";
import { handleManagerList } from "./tools/handleManagerList";
import { DataType } from "./types/data";
import { League } from "./types/league";

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
      const freshData = await cb(redisKey, params);
      resolve(freshData);
    });
  });
};

const fetchTeams = async (params: TeamsFetchType) => {
  console.log("fetchteams");
  let managerList = [];
  for (const resultObject of params.standings.results) {
    // TODO POISTA SLICE
    const req_url = `https://fantasy.premierleague.com/api/entry/${resultObject.entry.toString()}/event/${
      params.gw
    }/picks/`;
    const prev_gw = getPreviousGw(params.gw);
    const req_url_prev = `https://fantasy.premierleague.com/api/entry/${resultObject.entry.toString()}/event/${prev_gw}/picks/`;
    const manager_request = await superagent.get(req_url);
    const manager_request_previous_qw = await superagent.get(req_url_prev);
    const team = manager_request.body;
    const prev_team = manager_request_previous_qw.body;
    managerList.push({
      ...resultObject,
      team,
      prev_team,
    });
  }
  return handleManagerList(managerList);
};

const getPreviousGw = (gw: string): string => {
  if (parseInt(gw) > 1) return (parseInt(gw) - 1).toString();
  else return gw;
};

const fetchLeague = async (redisKey: string, params: LeagueFetchType) => {
  console.log("fetchleague:", params);
  try {
    const league_request = await superagent.get(
      `https://fantasy.premierleague.com/api/leagues-classic/${params.leagueId}/standings/`
    );
    const league: League = league_request.body;
    // TODO: Tallenna GW:t erikseen, nyt hakee turhaan edellisen viikon vaikka se vois olla tallessa
    const teams = await fetchTeams({ ...params, standings: league.standings });
    // const prev_gw_teams = await fetchTeams({
    //   leagueId: params.leagueId,
    //   gw: getPreviousGw(params.gw),
    //   standings: league.standings,
    // });
    const returnObject = { ...league, teams };
    redisClient.setex(
      redisKey,
      LEAGUE_EXPIRATION,
      JSON.stringify(returnObject)
    );
    return returnObject;
  } catch (err) {
    console.log("err : ", err);
    return err;
  }
};

const fetchDataFromFpl = async (redisKey: string) => {
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
  redisClient.setex(redisKey, FPLDATA_EXPIRATION, JSON.stringify(fpldata));
  return fpldata;
};

app.post("/api/league", async (req: Request, res: Response) => {
  try {
    const params: LeagueFetchType = req.body;
    const redisKey = `league:${params.leagueId}#gw:${params.gw}`;
    console.log("apileague", params);
    const league: League = await getOrSetCache(redisKey, fetchLeague, params);
    res.status(200).json(league);
  } catch (err) {
    res.status(404).json(err);
  }
});

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
