import { DataType } from "./types/data";

export const getPlayerName = (element: DataType["elements"][0]) =>
  `${element.first_name} ${element.web_name}`;
