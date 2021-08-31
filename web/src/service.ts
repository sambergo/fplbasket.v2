const baseUrl =
  process.env.NODE_ENV == "development" ? "http://localhost:3636/api" : "/api";
import axios from "axios";
import { LeagueFetchType } from "./types/LeagueFetchType";

export const getBssData = async () => {
  return await axios.get(`${baseUrl}/data`);
};

export const getLeague = async (params: LeagueFetchType) => {
  return await axios.post(`${baseUrl}/league`, params);
};
