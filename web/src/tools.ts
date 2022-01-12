import { DataType } from "./types/data";
import { LiveData } from "./types/livedata";
import { PlayerPick } from "./types/newleague";

export const getPlayerName = (
  element: DataType["elements"][0] | null
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
  element: DataType["elements"][0] | null
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
  teams: DataType["teams"]
) => {
  const team = teams[element.team - 1].short_name || "no";
  return team;
};

export const getGWs = (events: DataType["events"]): DataType["events"] => {
  let gws = events.filter((e) => e.finished);
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

export const stillToPlay = (pick: number, liveData: LiveData): boolean => {
  const element = liveData.elements[pick];
  if (!element) return false;
  const fixFinished: boolean[] = element.explain.map((e) => {
    const fixture = liveData.fixtures[e.fixture];
    if (!fixture?.finished) return true;
    else return false;
  });
  return fixFinished.includes(true);
};

export const fromTeamToPlay = (
  liveData: LiveData,
  picks: PlayerPick[]
): string => {
  const picksStillToPlay = picks.filter((pick) =>
    stillToPlay(pick.element, liveData)
  );
  const activePicks = picks.filter((pick) => pick.multiplier > 0);
  const finished = activePicks.length - picksStillToPlay.length;
  const returnString =
    finished.toString() + "/" + activePicks.length.toString();
  return returnString;
};
