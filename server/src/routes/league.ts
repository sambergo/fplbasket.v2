import { Request, Response, Router } from "express";
import { getParsedData } from "../tools/getParsedData";
import { getPreviousGwOrNull } from "../tools/helpers";
import { LeagueFetchType, TeamsFetchType } from "../types/LeagueFetchType";
import { LeagueType } from "../types/manager";
import { RedisSetCacheResponse } from "../types/redisCache";

const leagueRouter = Router();

const fetchFromUrl = async (req_url: string) => {
  const res = await fetch(req_url);
  const body = await res.json();
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

const getOrFetchLeague = async (params: any = null): Promise<any> => {
  console.log("getorfetchleague");

  const cbData = await fetchLeague(params);
  // const newObj = new Standings({
  //   ...cbData.freshData,
  //   id,
  // });
  return cbData.freshData;
};

const fetchLeague = async (
  params: LeagueFetchType,
): Promise<RedisSetCacheResponse> => {
  console.log("fetch league from fpl", params);
  try {
    console.log("fetchleague");
    const league_request = await fetch(
      `https://fantasy.premierleague.com/api/leagues-classic/${params.leagueId}/standings/`,
    );
    const league: LeagueType = await league_request.json();
    const managers = await fetchTeams({
      ...params,
      standings: league.standings,
    });
    const returnObject = {
      freshData: { ...league, managers },
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
    const league_curr: LeagueType = await getOrFetchLeague(params);
    const league_prev: LeagueType | null = !prev_gw
      ? null
      : await getOrFetchLeague({
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
