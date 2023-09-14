import { DataType } from "../types/bssData";
import { FixturesRoot } from "../types/fixtures";

export const getLeagueExpiration = async (
  bssData: DataType,
  gw: number,
): Promise<number> => {
  // console.log("get expiration:", gw);
  const timeNow = Date.now();
  const currentGw: DataType["events"][0] = bssData.events.find(
    (e) => e.is_current,
  )!;
  const nextGw: DataType["events"][0] = bssData.events.find((e) => e.is_next)!;
  const lastGw: DataType["events"][0] =
    bssData.events[bssData.events.length - 1];
  const MAX_EXPIRATION =
    (lastGw.deadline_time_epoch * 1000 - timeNow + 1000 * 60 * 60 * 24 * 60) /
    1000; // 60 days after last gw
  // Jos vanha GW niin maximi palautumisaika
  if (gw < currentGw.id) {
    return MAX_EXPIRATION;
  } else if (gw !== currentGw.id) return 1;
  // Jos GW päättynyt, 1vrk tai seuraavan gw deadlineen (pienempi)
  else if (currentGw.finished && currentGw.data_checked) {
    const timeNext = nextGw.deadline_time_epoch * 1000;
    const timeDiffNow = timeNext - timeNow;
    const timeMaxDiff = 1000 * 60 * 60 * 24 * 1; // 1vrk
    const returnTime = Math.min(timeDiffNow, timeMaxDiff) / 1000;
    return returnTime;
  }
  // Jos viimeinen ottelu pelaamatta, odotus siihen saakka. Jos vika pelattu ja odotellaan bonareita jne, 5min
  else {
    const fixturesUrl = `https://fantasy.premierleague.com/api/fixtures/?event=${gw}`;
    const fixturesReq = await fetch(fixturesUrl);
    const fixturesData: FixturesRoot = await fixturesReq.json();
    const lastGameKickOffTime =
      fixturesData[fixturesData.length - 1].kickoff_time;
    const lastGameKoEpoch = new Date(lastGameKickOffTime).getTime();
    const twoHours = 1000 * 60 * 60 * 2;
    const baseLine = lastGameKoEpoch + twoHours;
    if (timeNow < baseLine) {
      const diffToReturn = (baseLine - timeNow) / 1000;
      return diffToReturn;
    } else {
      return 60 * 5; // 5min
    }
  }
};
