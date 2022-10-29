import { DataType } from "src/types/bssData";
import superagent from "superagent";

export const fetchBssDataFromFpl = async (): Promise<any> => {
  const bootstrap_static = await superagent.get(
    `https://fantasy.premierleague.com/api/bootstrap-static/`
  );
  const fpldata: DataType = bootstrap_static.body;
  // Järjestää elementit id mukaan, joka on tarpeen frontissa
  let elements: DataType["elements"] = [];
  fpldata.elements.forEach((element) => {
    elements[element.id] = element;
  });
  fpldata.elements = elements;
  return fpldata;
};
