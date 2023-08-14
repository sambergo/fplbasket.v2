import { Request, Response, Router } from "express";
import { fetchBssDataFromFpl } from "../tools/fetchBssData";
import superagent from "superagent";
import Standings from "../models/Standings";
import dbConnect from "../tools/dbConnection";
import { getLeagueExpiration } from "../tools/expirations";
import { getParsedData } from "../tools/getParsedData";
import { getPreviousGwOrNull } from "../tools/helpers";
import { LeagueFetchType, TeamsFetchType } from "../types/LeagueFetchType";
import { LeagueType } from "../types/manager";
import { RedisSetCacheResponse } from "../types/redisCache";

dbConnect();

const leagueRouter = Router();

const fetchFromUrl = async (req_url: string) => {
  const { body } = await superagent.get(req_url);
  return body;
};

const fetchTeams = async (params: TeamsFetchType) => {
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
    return {
      ...resultObject,
      gw_team,
      transfers,
      history,
    };
  });
  return Promise.all(tasks);
};

const getOrFetchLeague = async (
  id: string,
  params: any = null
): Promise<any> => {
  console.log("getorfetchleague");
  const data = await Standings.findOne({ id }); // TODO and timestamp
  const timeNow = new Date().getTime();
  const isFreshEnough = data && timeNow < data.ex;
  if (data && isFreshEnough) {
    console.log("IS FRESH ENOUGH");
    return data;
  } else {
    await Standings.deleteMany({ id });
    const cbData = await fetchLeague(params);
    const ex = timeNow + 1000 * cbData.ex;
    const newObj = new Standings({
      ...cbData.freshData,
      id,
      ex,
    });
    return newObj.save();
  }
};

const fetchLeague = async (
  params: LeagueFetchType
): Promise<RedisSetCacheResponse> => {
  console.log("fetch league from fpl", params);
  try {
    console.log("fetchleague");
    const league_request = await superagent.get(
      `https://fantasy.premierleague.com/api/leagues-classic/${params.leagueId}/standings/`
    );
    const league: LeagueType = league_request.body;
    // const bssData: DataType = await getOrSetCache(
    //   redisKey_bssData,
    //   fetchBssDataFromFpl
    // );
    const bssData = await fetchBssDataFromFpl();
    const league_expiration = await getLeagueExpiration(
      bssData,
      parseInt(params.gw)
    );
    const managers = await fetchTeams({
      ...params,
      standings: league.standings,
    });
    const returnObject = {
      freshData: { ...league, managers },
      ex: league_expiration,
    };
    return returnObject;
  } catch (err) {
    console.log("err : ", err);
    return err;
  }
};

leagueRouter.post("/", async (req: Request, res: Response) => {
  try {
    const params: LeagueFetchType = req.body;
    const prev_gw = getPreviousGwOrNull(params.gw);
    console.log(`${params.leagueId} haettu gw ${params.gw}. ${new Date()}`);
    const mongoId_curr = `league:${params.leagueId}#gw:${params.gw}`;
    const mongoId_prev = `league:${params.leagueId}#gw:${prev_gw}`;
    const league_curr: LeagueType = await getOrFetchLeague(
      mongoId_curr,
      params
    );
    const league_prev: LeagueType | null = !prev_gw
      ? null
      : await getOrFetchLeague(mongoId_prev, {
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

module.exports = leagueRouter;
