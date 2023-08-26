import { DataType } from "src/types/bssData";
import superagent from "superagent";

export const fetchBssDataFromFpl = async (): Promise<any> => {
  try {
    const bootstrapStatic = await superagent.get(
      `https://fantasy.premierleague.com/api/bootstrap-static/`
    );
    const fplData: DataType = bootstrapStatic.body;
    // Järjestää elementit id mukaan, joka on tarpeen frontissa
    let elements: DataType["elements"] = [];
    fplData.elements.forEach((element) => {
      elements[element.id] = element;
    });
    fplData.elements = elements;
    return fplData;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
