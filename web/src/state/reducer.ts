import { State } from "./state";
import { DataType } from "../types/data";
import { CurrPrevAndParsedLeague } from "../types/newleague";
import { getGWs } from "../tools";

export type Action =
  | {
      type: "SET_BSS_DATA";
      payload: DataType;
    }
  | {
      type: "SET_LEAGUE_DATA";
      payload: CurrPrevAndParsedLeague;
    }
  | {
      type: "SET_SELECTED_GW";
      payload: string;
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_BSS_DATA":
      return {
        ...state,
        bssData: {
          ...action.payload,
        },
        gwsData: getGWs(action.payload.events),
      };
    case "SET_LEAGUE_DATA":
      return {
        ...state,
        leagueData: {
          ...action.payload,
        },
      };
    case "SET_SELECTED_GW":
      return {
        ...state,
        selectedGw: action.payload,
      };
    default:
      return state;
  }
};
