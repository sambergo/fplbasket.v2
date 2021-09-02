import cors from "cors";
import express, { Request, Response } from "express";
import Redis from "redis";
import superagent from "superagent";
import { DataType } from "./types/data";
import { League, Result } from "./types/league";
import { Team } from "./types/manager";
// const data: DataType = require("./data/data");
// const league: League = require("./data/league")
// const manager: Manager = require("./data/manager")

const app = express();
const PORT = 3636;
const FPLDATA_EXPIRATION = 60 * 60;
const LEAGUE_EXPIRATION = 60 * 60 * 712;
const redisClient = Redis.createClient();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
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

const handleTeam = (team: Team) => {
  let { picks } = team;
  for (const sub of team.automatic_subs) {
    const playerInIndex = picks.findIndex((p) => p.element == sub.element_in);
    const playerOutIndex = picks.findIndex((p) => p.element == sub.element_out);
    const playerInObject = picks[playerInIndex];
    picks[playerInIndex] = picks[playerOutIndex];
    picks[playerOutIndex] = playerInObject;
  }
  team.picks = picks;
  return team;
};

interface Manager extends Result {
  team: Team;
}
const handleManagerList = (managerList: Manager[]) => {
  const captains = Array.from(
    new Set(
      managerList
        .map((m) => m.team.picks.find((p) => p.is_captain))
        .map((p) => p?.element)
    )
  ).map((captain) => ({
    captain,
    captainedBy: managerList
      .filter((manager) => manager.team.picks.find((p) => p.element == captain))
      .map((m) => m.player_name),
  }));

  const players = Array.from(
    new Set(
      managerList
        .map((m) => m.team.picks)
        .reduce((arr, item) => [...arr, ...item], [])
        .map((p) => p.element)
    )
  ).map((player) => ({
    player,
    ownedBy: managerList
      .filter((managerObject) => {
        const bboost = managerObject.team.active_chip == "bboost";
        return managerObject.team.picks
          .map((p) => p)
          .slice(0, bboost ? 15 : 11)
          .map((p) => p.element)
          .includes(player);
      })
      .map((m) => m.player_name),
  }));

  const returnObject = {
    managerList,
    captains,
    players,
  };
  return returnObject;
};

const fetchTeams = async (params: TeamsFetchType) => {
  console.log("fetchteams", params.standings.results[0]);
  let managerList = [];
  for (const resultObject of params.standings.results) {
    // TODO POISTA SLICE
    console.log("resultObject", resultObject);
    const req_url = `https://fantasy.premierleague.com/api/entry/${resultObject.entry.toString()}/event/${
      params.gw
    }/picks/`;
    // console.log(req_url);
    const manager_request = await superagent.get(req_url);
    const team: Team = handleTeam(manager_request.body);
    managerList.push({ ...resultObject, team });
  }
  // managerList = handleManagerList(managerList)
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
    const prev_gw_teams = await fetchTeams({
      leagueId: params.leagueId,
      gw: getPreviousGw(params.gw),
      standings: league.standings,
    });
    console.log("teams", prev_gw_teams);
    const returnObject = { ...league, teams, prev_gw_teams };
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
  // Arrange elements by id
  let elements: DataType["elements"] = [];
  fpldata.elements.forEach((element) => {
    elements[element.id] = element;
  });
  fpldata.elements = elements;
  redisClient.setex(redisKey, FPLDATA_EXPIRATION, JSON.stringify(fpldata));
  return fpldata;
};

interface LeagueFetchType {
  gw: string;
  leagueId: string;
}

interface TeamsFetchType extends LeagueFetchType {
  standings: League["standings"];
}

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
