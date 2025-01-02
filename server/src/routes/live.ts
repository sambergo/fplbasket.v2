import axios from 'axios';
import { Request, Response, Router } from "express";
import { getParsedLive } from "../tools/getParsedLive";
import { Fixtures, FixturesRoot } from "../types/fixtures";
import { LiveFetchType } from "../types/LeagueFetchType";
import { RootLiveElements } from "../types/liveElements";

const liveRouter = Router();

const fetchLiveElements = async ({ gw }: LiveFetchType): Promise<any> => {
  try {
    const [{ data: livedata }, { data: fixtures_body }] = await Promise.all([
      axios.get<RootLiveElements>(`https://fantasy.premierleague.com/api/event/${gw}/live/`, {
        timeout: 10000
      }),
      axios.get<FixturesRoot>(`https://fantasy.premierleague.com/api/fixtures/?event=${gw}`, {
        timeout: 10000
      }),
    ]);
    const elements: RootLiveElements["elements"] = [];
    const fixtures: Fixtures[] = [];
    console.log(1);
    livedata.elements.forEach(
      (element, _index) => (elements[element.id] = element),
    );
    fixtures_body.forEach(
      (fixture, _index) => (fixtures[fixture.id] = fixture),
    );
    console.log(2);
    const parsedElements = getParsedLive(elements, fixtures);
    console.log("done");
    return { elements: parsedElements, fixtures };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out after 10 seconds');
      }
      throw new Error(error.message);
    }
    throw error;
  }
};

liveRouter.post("/", async (req: Request, res: Response) => {
  try {
    const params: LiveFetchType = req.body;
    console.log("live", params);
    const liveElements = await fetchLiveElements(params);
    res.status(200).json(liveElements);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      res.status(error.response?.status || 500).json({
        message: error.message,
        error: error.response?.data || error.message
      });
    } else {
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }
});

module.exports = liveRouter;
