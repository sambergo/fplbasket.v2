import { DataType } from "./types/data";

export const getPlayerName = (
  element: DataType["elements"][0] | null
): string => {
  if (!element) return "";
  return `${element.first_name} ${element.second_name}`;
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

export const getElementsTeam = (
  element: DataType["elements"][0],
  teams: DataType["teams"]
) => {
  const team = teams[element.team - 1].name || "no";
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
