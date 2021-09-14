import superagent from "superagent";
import { DataType } from "../types/data";
import { Fixtures, FixturesRoot } from "../types/fixtures";

export const getBssDataExpiration = async (
  bssData: DataType,
  gw: number
): Promise<number> => {
  console.log("get bssdata expiration");
  const timeNow = Date.now();
  const currentGw: DataType["events"][0] = bssData.events.find(
    (e) => e.is_current
  )!;
  // const nextGw: DataType["events"][0] = bssData.events.find((e) => e.is_next);
  const lastGw: DataType["events"][0] =
    bssData.events[bssData.events.length - 1];
  const MAX_EXPIRATION =
    lastGw.deadline_time_epoch * 1000 - timeNow + 1000 * 60 * 60 * 24 * 30; // 30 days after last gw
  if (gw < currentGw.id) {
    console.log("max expiration:", gw);
    return MAX_EXPIRATION;
  }
  const fixtureIsLive = (fixture: Fixtures) => {
    const fixEpoch = new Date(fixture.kickoff_time).getTime();
    const fixDiff = 1000 * 60 * 60 * 2; // 2h
    console.log("fix erot:", fixEpoch, fixDiff);
    if (fixEpoch > timeNow && fixEpoch < timeNow + fixDiff) {
      console.log("ACTIVE FIXTURE:", fixture);
      return true;
    } else return false;
  };
  const fixturesUrl = `https://fantasy.premierleague.com/api/fixtures/?event=${gw}`;
  const fixturesReq = await superagent.get(fixturesUrl);
  const fixturesData: FixturesRoot = fixturesReq.body;
  console.log(typeof fixturesData);
  const erotus =
    bssData.events.find((e) => e.is_next)!.deadline_time_epoch * 1000 - timeNow;
  console.log(erotus / 1000 / 60 / 60);
  fixturesData.forEach((f) => fixtureIsLive(f));
  return 1;
};

const f = async () => {
  const bootstrap_static = await superagent.get(
    `https://fantasy.premierleague.com/api/bootstrap-static/`
  );
  const myData: DataType = bootstrap_static.body;
  getBssDataExpiration(myData, 4);
};

f();
/*
1. Ei tarvi päivittää ennenkuin gw starttaa
2. 

  */

// const myData: Root = testData;
// for (const a in myData) {
//   console.log(a);
// }
// // getBssDataExpiration(testData, 1);
