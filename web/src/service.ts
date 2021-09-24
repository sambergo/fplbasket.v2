const baseUrl =
  process.env.NODE_ENV == "development" ? "http://localhost:3636/api" : "/api";
import axios from "axios";
import { LeagueFetchType, LiveFetchType } from "./types/fetchTypes";

export const getBssData = async () => {
  return await axios.get(`${baseUrl}/data`);
};

export const getLeague = async (params: LeagueFetchType) => {
  return await axios.post(`${baseUrl}/league`, params);
};

export const getLiveElements = async (params: LiveFetchType) => {
  return await axios.post(`${baseUrl}/live`, params);
};
