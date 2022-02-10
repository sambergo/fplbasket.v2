import { getGWs } from "../tools";
import { DataType } from "../types/data";
import { LiveData } from "../types/livedata";
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
      type: "SET_SHOW_LIVE_BONUS";
      payload: boolean;
    }
  | {
      type: "SET_LIVE_ELEMENTS";
      payload: LiveData;
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
        liveData: action.payload,
        showLiveBonusDisabled: !action.payload.fixtures.some(
          (fix) => fix?.started && !fix.finished
        ),
      };
    default:
      return state;
  }
};
