import { Request, Response, Router } from "express";
import { fetchBssDataFromFpl } from "../tools/fetchBssData";

const dataRouter = Router();

dataRouter.get("/", async (_req: Request, res: Response) => {
  try {
    console.log("bssData");
    const bssData = await fetchBssDataFromFpl();
    res.status(200).json(bssData);
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = dataRouter;
