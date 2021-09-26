import { getGWs } from "../tools";
import { DataType } from "../types/data";
import { LiveElement } from "../types/liveElements";
import { CurrPrevAndParsedLeague } from "../types/newleague";
import { State } from "./state";

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
      type: "RESET_LEAGUE_DATA";
      payload: any;
    }
  | {
      type: "SET_SELECTED_GW";
      payload: string;
    }
  | {
      type: "SET_LIVE_ELEMENTS";
      payload: LiveElement[];
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_BSS_DATA":
      const gws = getGWs(action.payload.events);
      return {
        ...state,
        bssData: {
          ...action.payload,
        },
        gwsData: gws,
        selectedGw: gws[0].id.toString(),
      };
    case "SET_LEAGUE_DATA":
      return {
        ...state,
        leagueData: {
          ...action.payload,
        },
      };
    case "RESET_LEAGUE_DATA":
      return {
        ...state,
        leagueData: null,
      };
    case "SET_SELECTED_GW":
      return {
        ...state,
        selectedGw: action.payload,
      };
    case "SET_LIVE_ELEMENTS":
      return {
        ...state,
        liveElements: action.payload,
      };
    default:
      return state;
  }
};
