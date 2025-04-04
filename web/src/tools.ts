import { DataType } from "./types/data";
import { ElementLive, LiveData } from "./types/livedata";
import { PlayerPick } from "./types/newleague";

export const getPlayerName = (
  element: DataType["elements"][0] | null,
): string => {
  if (!element) return "";
  const first_name =
    element.first_name.length < 10
      ? element.first_name
      : element.first_name.split(" ")[0];
  const fullname = first_name + " " + element.second_name;

  return fullname.length < 20 ? fullname : element.web_name;
};

export const getPlayerWebName = (
  element: DataType["elements"][0] | null,
): string => {
  if (!element) return "";
  return element.web_name;
};

export const getPlayerPosition = (element: DataType["elements"][0]) => {
  switch (element.element_type) {
    case 1:
      return "GKP";
    case 2:
      return "DEF";
    case 3:
      return "MID";
    case 4:
      return "FWD";
    case 5:
      return "MNG";
    default:
      return "";
  }
};

export const getElementType = (a: DataType["elements"][0] | undefined) => {
  if (a) return a.element_type;
  else return 0;
};

export const getElementsTeam = (
  element: DataType["elements"][0],
  teams: DataType["teams"],
) => {
  const team = teams[element.team - 1].short_name || "no";
  return team;
};

export const getGWs = (events: DataType["events"]): DataType["events"] => {
  let gws = events.filter((e) => e.finished);
  if (gws.length == 0) {
    return [events[0]];
  }
  const delay = 20 * 60 * 1000;
  for (let e of events) {
    // @ts-ignore
    const dd_diff = new Date() - new Date(e.deadline_time);
    if (!e.finished && dd_diff > delay) {
      gws.push(e);
    }
  }
  return gws.reverse();
};

export const stillToPlay = (pick: number, liveData: LiveData): string => {
  const element = liveData.elements[pick];
  if (!element) return "";
  const fixFinished: string[] = element.explain.map((e) => {
    const fixture = liveData.fixtures[e.fixture];
    if (!fixture?.finished_provisional) return "🏇";
    else return "🏁";
  });
  return fixFinished.join("");
};

export const fromTeamToPlay = (
  liveData: LiveData,
  picks: PlayerPick[],
): string => {
  const picksStillToPlay = picks.reduce((prev, curr) => {
    const element = liveData.elements[curr.element];
    if (!element || curr.multiplier < 1) return prev;
    const fixture =
      element.explain.filter(
        (e) => !liveData.fixtures[e.fixture]?.finished_provisional,
      ).length + prev;
    return fixture;
  }, 0);
  const totalMatches = picks.reduce((prev, curr) => {
    const element = liveData.elements[curr.element];
    if (!element || curr.multiplier < 1) return prev;
    return element.explain.length + prev;
  }, 0);
  const returnString = picksStillToPlay + " / " + totalMatches;
  return picksStillToPlay === 0 ? "✅" : returnString;
};

export const getElementPoints = (
  element: ElementLive | null,
  showLiveBonus: boolean,
): number => {
  if (!element) return 0;
  const minusLiveBonus = showLiveBonus ? 0 : element.live_bps ?? 0;
  return element.stats.total_points - minusLiveBonus;
};

export const getArrow = (
  old_rank: number,
  i: number,
  managersLength: number,
): number => {
  if (old_rank < i) return 0;
  else if (old_rank === i) return 1;
  else if (old_rank > i + Math.max(3, Math.ceil(managersLength / 5))) return 3;
  else return 2;
};

export const getSomeFixtureIsActive = (liveData: LiveData | null): boolean => {
  console.log("getactive");
  if (!liveData?.fixtures) return true;
  const vastaus = !liveData.fixtures.some(
    (fix) => fix?.started && !fix.finished,
  );
  console.log("vastaus:", vastaus);
  return vastaus;
};
