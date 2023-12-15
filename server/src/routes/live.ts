import { Request, Response, Router } from "express";
import { getParsedLive } from "../tools/getParsedLive";
import { Fixtures, FixturesRoot } from "../types/fixtures";
import { LiveFetchType } from "../types/LeagueFetchType";
import { RootLiveElements } from "../types/liveElements";

const liveRouter = Router();

const fetchLiveElements = async ({ gw }: LiveFetchType): Promise<any> => {
  try {
    const [event_live, fixtures_req] = await Promise.all([
      fetch(`https://fantasy.premierleague.com/api/event/${gw}/live/`),
      fetch(`https://fantasy.premierleague.com/api/fixtures/?event=${gw}`),
    ]);
    const livedata: RootLiveElements = await event_live.json();
    const fixtures_body: FixturesRoot = await fixtures_req.json();
    const elements: RootLiveElements["elements"] = [];
    const fixtures: Fixtures[] = [];
    livedata.elements.forEach(
      (element, _index) => (elements[element.id] = element),
    );
    fixtures_body.forEach(
      (fixture, _index) => (fixtures[fixture.id] = fixture),
    );
    return { elements: getParsedLive(elements, fixtures), fixtures };
  } catch (err) {
    throw err;
  }
};

liveRouter.post("/", async (req: Request, res: Response) => {
  try {
    console.log("live");
    const params: LiveFetchType = req.body;
    const liveElements = await fetchLiveElements(params);
    res.status(200).json(liveElements);
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = liveRouter;
