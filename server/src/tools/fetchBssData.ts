import axios from 'axios';
import { DataType } from "src/types/bssData";

export const fetchBssDataFromFpl = async (): Promise<any> => {
  try {
    const { data: fplData } = await axios.get<DataType>(
      'https://fantasy.premierleague.com/api/bootstrap-static/',
      {
        timeout: 2000 // 10 seconds timeout
      }
    );
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
