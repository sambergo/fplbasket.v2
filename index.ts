import express from"express";
import Redis from "redis";
import {Request, Response} from 'express'
import superagent from 'superagent'

import { DataType } from "./types/data";
// import { League } from "./types/league";
// import { Manager } from "./types/manager";

// const data: DataType = require("./data/data");
// const league: League = require("./data/league")
// const manager: Manager = require("./data/manager")

const app = express();
const PORT = 3636;
const FPLDATA_EXPIRATION = 60 * 1 // 5min
const redisClient = Redis.createClient();
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.use(express.static('build'));
app.use('/id/*', express.static('build'));


app.get("/api/data", async (_req: Request, res: Response) => {
  redisClient.get("fpldata", async (error, fpldata) => {
    if (error) {
      console.error(error)
      res.status(404).json({error: error});
    }
    else if (fpldata){
      console.log('fpldata löyty')
      const parsed_fpldata: DataType = JSON.parse(fpldata)
      res.status(200).json(parsed_fpldata)
    } 
    else {
     const bootstrap_static = await superagent.get(`https://fantasy.premierleague.com/api/bootstrap-static/`)
     const fpldata: DataType = bootstrap_static.body
     redisClient.setex("fpldata", FPLDATA_EXPIRATION, JSON.stringify(fpldata))
     console.log("fpldata asetettu")
     res.status(200).json(fpldata)
    }
  })
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

