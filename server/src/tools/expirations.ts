import superagent from "superagent";
import { DataType } from "../types/data";
import { FixturesRoot } from "../types/fixtures";

export const getLeagueExpiration = async (
  bssData: DataType,
  gw: number
): Promise<number> => {
  const timeNow = Date.now();
  const currentGw: DataType["events"][0] = bssData.events.find(
    (e) => e.is_current
  )!;
  const lastGw: DataType["events"][0] =
    bssData.events[bssData.events.length - 1];
  const MAX_EXPIRATION =
    (lastGw.deadline_time_epoch * 1000 - timeNow + 1000 * 60 * 60 * 24 * 60) /
    1000; // 60 days after last gw
  if (gw < currentGw.id) {
    return MAX_EXPIRATION;
  } else if (gw !== currentGw.id) return 1;
  else if (currentGw.finished) {
    return 60 * 60 * 24 // TODO: paremmaks, nyt 1vrk
  } else {
    const fixturesUrl = `https://fantasy.premierleague.com/api/fixtures/?event=${gw}`;
    const fixturesReq = await superagent.get(fixturesUrl);
    const fixturesData: FixturesRoot = fixturesReq.body;
    const lastGameKickOffTime =
      fixturesData[fixturesData.length - 1].kickoff_time;
    const lastGameKoEpoch = new Date(lastGameKickOffTime).getTime();
    const twoHours = 1000 * 60 * 60 * 2;
    const baseLine = lastGameKoEpoch + twoHours;
    if (timeNow < baseLine) {
      const diffToReturn = (baseLine - timeNow) / 1000;
      return diffToReturn;
    } else return 60 * 5; // 5min
    // jos klo alle takaraja niin vanheneminen siihen saakka, muuten 5min
  }
};
