import superagent from "superagent";
import { DataType } from "../types/data";
import { FixturesRoot } from "../types/fixtures";

export const getBssDataExpiration = async (
  bssData: DataType,
  gw: number
): Promise<number> => {
  console.log("get league expiration");
  // const timeNow = Date.now();
  const aika = new Date(2021, 8, 11, 18, 0, 0, 0);
  const timeNow = aika.getTime();
  console.log("timeNow :", timeNow);
  const currentGw: DataType["events"][0] = bssData.events.find(
    (e) => e.is_current
  )!;
  // const nextGw: DataType["events"][0] = bssData.events.find((e) => e.is_next);
  const lastGw: DataType["events"][0] =
    bssData.events[bssData.events.length - 1];
  const MAX_EXPIRATION =
    (lastGw.deadline_time_epoch * 1000 - timeNow + 1000 * 60 * 60 * 24 * 60) /
    1000; // 60 days after last gw
  console.log("maxi:", MAX_EXPIRATION);
  if (gw < currentGw.id) {
    console.log("vanha gw:", gw);
    return MAX_EXPIRATION;
  } else if (gw !== currentGw.id) throw new Error("Invalid gw");
  // else if (currentGw.finished) {
  //   console.log("gw päättynyt");
  //   return MAX_EXPIRATION;
  // }
  else {
    const fixturesUrl = `https://fantasy.premierleague.com/api/fixtures/?event=${gw}`;
    const fixturesReq = await superagent.get(fixturesUrl);
    const fixturesData: FixturesRoot = fixturesReq.body;
    const lastGameKickOffTime =
      fixturesData[fixturesData.length - 1].kickoff_time;
    const lastGameKoEpoch = new Date(lastGameKickOffTime).getTime();
    const twoHours = 1000 * 60 * 60 * 2;
    const baseLine = lastGameKoEpoch + twoHours;
    console.log("twoHours:", twoHours);
    console.log("lastGameKoEpoch:", lastGameKoEpoch);
    console.log("baseLine:", baseLine, new Date(baseLine));
    if (timeNow < baseLine) {
      const diffToReturn = baseLine - timeNow / 1000;
      console.log("gw kesken:", diffToReturn);
      return diffToReturn;
    } else return 60 * 5; // 5min
    // jos klo alle takaraja niin vanheneminen siihen saakka, muuten 5min
  }
  //   const fixtureIsLive = (fixture: Fixtures) => {
  //     const fixEpoch = new Date(fixture.kickoff_time).getTime();
  //     const fixDiff = 1000 * 60 * 60 * 2; // 2h
  //     console.log("fix erot:", fixEpoch, fixDiff);
  //     if (fixEpoch > timeNow && fixEpoch < timeNow + fixDiff) {
  //       console.log("ACTIVE FIXTURE:", fixture);
  //       return true;
  //     } else return false;
  //   };
  //   const fixturesUrl = `https://fantasy.premierleague.com/api/fixtures/?event=${gw}`;
  //   const fixturesReq = await superagent.get(fixturesUrl);
  //   const fixturesData: FixturesRoot = fixturesReq.body;
  //   console.log(typeof fixturesData);
  //   fixturesData[fixturesData.length - 1].kickoff_time;

  //   const erotus =
  //     bssData.events.find((e) => e.is_next)!.deadline_time_epoch * 1000 - timeNow;
  //   fixturesData.forEach((f) => fixtureIsLive(f));
  //   return 1;
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
  - jos ei oo current mitä sit?? tarkistus pitää tehä jo aiemmin tai sit throw error nyt
2. vikan matsin jälkeen 2h asti ei tarvi päivittää?
3. sit voi alkaa päivittää , mutta pitää tarkistaa et kun kierros on done niin MAX_EXPIRATION, onko sen jälkeen vastan bssdatan eventsien finished true??



*/
