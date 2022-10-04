import { Request, Response, Router } from "express";
import superagent from "superagent";
import { getOrSetCache } from "../tools/getOrSetCache";
import { DataType } from "../types/bssData";
import { RedisSetCacheResponse } from "../types/redisCache";

const FPLDATA_EXPIRATION = 60;
const redisKey_bssData = "bssdata";
const dataRouter = Router();

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

dataRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const data = await getOrSetCache(redisKey_bssData, fetchBssDataFromFpl);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = dataRouter;
