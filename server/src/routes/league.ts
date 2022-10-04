import { Request, Response, Router } from "express";
import superagent from "superagent";
import Standings from "../models/Standings";
import dbConnect from "../tools/dbConnection";
import { getLeagueExpiration } from "../tools/expirations";
import { getOrSetCache } from "../tools/getOrSetCache";
import { getParsedData } from "../tools/getParsedData";
import { getPreviousGwOrNull } from "../tools/helpers";
import { DataType } from "../types/bssData";
import { LeagueFetchType, TeamsFetchType } from "../types/LeagueFetchType";
import { LeagueType } from "../types/manager";
import { RedisSetCacheResponse } from "../types/redisCache";

dbConnect();

const FPLDATA_EXPIRATION = 60;

const leagueRouter = Router();

const fetchFromUrl = async (req_url: string) => {
  const { body } = await superagent.get(req_url);
  return body;
};

const fetchTeams = async (params: TeamsFetchType) => {
  let resultList = [];
  for (const resultObject of params.standings.results) {
    const entry = resultObject.entry.toString();
    const picks_url = `https://fantasy.premierleague.com/api/entry/${entry}/event/${params.gw}/picks/`;
    const transfers_url = `https://fantasy.premierleague.com/api/entry/${entry}/transfers/`;
    const history_url = `https://fantasy.premierleague.com/api/entry/${entry}/history/`;
    const gw_team = await fetchFromUrl(picks_url);
    const transfers = await fetchFromUrl(transfers_url);
    const history = await fetchFromUrl(history_url);
    resultList.push({
      ...resultObject,
      gw_team,
      transfers,
      history,
    });
  }
  return resultList;
};

const getOrFetchLeague = async (
  id: string,
  params: any = null
): Promise<any> => {
  const data = await Standings.findOne({ $and: [{ id }] }); // TODO and timestamp
  const timeNow = new Date().getTime();
  const isFreshEnough = timeNow < data?.ex;
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

const redisKey_bssData = "bssdata";

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

const fetchLeague = async (
  params: LeagueFetchType
): Promise<RedisSetCacheResponse> => {
  console.log("fetch league from fpl", params);
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
