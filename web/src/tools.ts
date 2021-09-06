import { DataType } from "./types/data";
import { Pick } from "./types/league";

export const getPlayerName = (element: DataType["elements"][0]) =>
  `${element.first_name} ${element.web_name}`;

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
