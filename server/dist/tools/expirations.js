"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeagueExpiration = void 0;
const superagent_1 = __importDefault(require("superagent"));
const getLeagueExpiration = async (bssData, gw) => {
    console.log("get league expiration");
    const timeNow = Date.now();
    console.log("timeNow :", timeNow);
    const currentGw = bssData.events.find((e) => e.is_current);
    const lastGw = bssData.events[bssData.events.length - 1];
    const MAX_EXPIRATION = (lastGw.deadline_time_epoch * 1000 - timeNow + 1000 * 60 * 60 * 24 * 60) /
        1000;
    console.log("maxi:", MAX_EXPIRATION);
    if (gw < currentGw.id) {
        console.log("vanha gw:", gw);
        return MAX_EXPIRATION;
    }
    else if (gw !== currentGw.id)
        return 1;
    else if (currentGw.finished) {
        console.log("gw päättynyt");
        return MAX_EXPIRATION;
    }
    else {
        const fixturesUrl = `https://fantasy.premierleague.com/api/fixtures/?event=${gw}`;
        const fixturesReq = await superagent_1.default.get(fixturesUrl);
        const fixturesData = fixturesReq.body;
        const lastGameKickOffTime = fixturesData[fixturesData.length - 1].kickoff_time;
        const lastGameKoEpoch = new Date(lastGameKickOffTime).getTime();
        const twoHours = 1000 * 60 * 60 * 2;
        const baseLine = lastGameKoEpoch + twoHours;
        if (timeNow < baseLine) {
            const diffToReturn = (baseLine - timeNow) / 1000;
            console.log("gw kesken:", diffToReturn);
            return diffToReturn;
        }
        else
            return 60 * 5;
    }
};
exports.getLeagueExpiration = getLeagueExpiration;
//# sourceMappingURL=expirations.js.map