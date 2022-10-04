import { Request, Response, Router } from "express";
import superagent from "superagent";
import { getOrSetCache } from "../tools/getOrSetCache";
import { getParsedLive } from "../tools/getParsedLive";
import { Fixtures, FixturesRoot } from "../types/fixtures";
import { LiveFetchType } from "../types/LeagueFetchType";
import { RootLiveElements } from "../types/liveElements";
import { RedisSetCacheResponse } from "../types/redisCache";

const LIVE_ELEMENTS_EXPIRATION = 10;
const liveRouter = Router();

const fetchLiveElements = async (
  params: LiveFetchType
): Promise<RedisSetCacheResponse> => {
  const event_live = await superagent.get(
    `https://fantasy.premierleague.com/api/event/${params.gw}/live/`
  );
  const fixtures_req = await superagent.get(
    `https://fantasy.premierleague.com/api/fixtures/?event=${params.gw}`
  );
  const livedata: RootLiveElements = event_live.body;
  const fixtures_body: FixturesRoot = fixtures_req.body;
  const elements: RootLiveElements["elements"] = [];
  const fixtures: Fixtures[] = [];
  livedata.elements.forEach((element) => (elements[element.id] = element));
  fixtures_body.forEach((fixture) => (fixtures[fixture.id] = fixture));
  const returnObject = {
    freshData: { elements: getParsedLive(elements, fixtures), fixtures },
    ex: LIVE_ELEMENTS_EXPIRATION,
  };
  return returnObject;
};

liveRouter.post("/", async (req: Request, res: Response) => {
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

module.exports = liveRouter;
