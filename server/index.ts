import express, { Request, Response } from 'express';
import Redis from 'redis';
import superagent from 'superagent';
import { DataType } from './types/data';

import { League } from './types/league';
// import { Manager } from './types/manager';
// const data: DataType = require("./data/data");
// const league: League = require("./data/league")
// const manager: Manager = require("./data/manager")

const app = express();
const PORT = 3636;
const FPLDATA_EXPIRATION = 60 * 60; // 5min
const LEAGUE_EXPIRATION = 60 * 60; // 5min
const redisClient = Redis.createClient();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads
app.use(express.static('build'));
app.use('/id/*', express.static('build'));

// TODO virheenhallinta jos redis ei toimi
const getOrSetCache = async (
  key: string,
  cb: Function,
  params: any = null
): Promise<any> => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (error, data) => {
      if (error) return reject(error);
      if (data) return resolve(JSON.parse(data));
      const freshData = await cb(params);
      resolve(freshData);
    });
  });
};

const fetchTeams = async (params: TeamsFetchType) => {
  console.log('fetchteams', params.standings.results[0]);
  let managers = [];
  for (const resultObject of params.standings.results.slice(0, 2)) {
    // TODO POISTA SLICE
    console.log('resultObject', resultObject);
    const req_url = `https://fantasy.premierleague.com/api/entry/${resultObject.entry.toString()}/event/${
      params.gw
    }/picks/`;
    // console.log(req_url);
    const manager_request = await superagent.get(req_url);
    console.log('manreq', manager_request);
    managers.push({ ...resultObject, team: manager_request.body });
  }
  console.log('MANAGERS', managers);
  return managers;
};

const getPreviousGw = (gw: string): string => {
  if (parseInt(gw) > 1) return (parseInt(gw) - 1).toString();
  else return gw;
};

const fetchLeague = async (params: LeagueFetchType) => {
  console.log('fetchleague:', params);
  const league_request = await superagent.get(
    `https://fantasy.premierleague.com/api/leagues-classic/${params.id}/standings/`
  );
  const league: League = league_request.body;
  const teams = await fetchTeams({ ...params, standings: league.standings });
  const prev_gw_teams = await fetchTeams({
    id: params.id,
    gw: getPreviousGw(params.gw),
    standings: league.standings,
  });
  console.log('teams', prev_gw_teams);
  const returnObject = { ...league, teams, prev_gw_teams };
  redisClient.setex(
    `league:${params.id}`,
    LEAGUE_EXPIRATION,
    JSON.stringify(returnObject)
  );
  return returnObject;
};

const fetchDataFromFpl = async () => {
  const bootstrap_static = await superagent.get(
    `https://fantasy.premierleague.com/api/bootstrap-static/`
  );
  const fpldata: DataType = bootstrap_static.body;
  // Arrange elements by id
  let elements: DataType['elements'] = [];
  fpldata.elements.forEach((element) => {
    elements[element.id] = element;
  });
  fpldata.elements = elements;
  redisClient.setex('fpldata', FPLDATA_EXPIRATION, JSON.stringify(fpldata));
  return fpldata;
};

interface LeagueFetchType {
  gw: string;
  id: string;
}

interface TeamsFetchType extends LeagueFetchType {
  standings: League['standings'];
}

app.post('/api/league', async (req: Request, res: Response) => {
  try {
    const params: LeagueFetchType = req.body;
    console.log('apileague', params);
    const league: League = await getOrSetCache(
      `league:${params.id}`,
      fetchLeague,
      params
    );

    res.status(200).json(league);
  } catch (err) {
    res.status(404).json(err);
  }
});

app.get('/api/data', async (_req: Request, res: Response) => {
  console.log('api-data');
  try {
    const data = await getOrSetCache('fpldata', fetchDataFromFpl);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json(err);
  }
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
