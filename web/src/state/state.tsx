import React, { createContext, useContext, useReducer } from "react";
import { DataType } from "../types/data";
import { CurrPrevAndParsedLeague } from "../types/newleague";

import { Action } from "./reducer";

export type State = {
  bssData: DataType | null;
  leagueData: CurrPrevAndParsedLeague | null;
  gwsData: DataType["events"];
  selectedGw: string;
};

const initialState: State = {
  bssData: null,
  leagueData: null,
  gwsData: [],
  selectedGw: "",
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState,
]);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export const StateProvider: React.FC<StateProviderProps> = ({
  reducer,
  children,
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);
