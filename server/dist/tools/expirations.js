"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeagueExpiration = void 0;
const getLeagueExpiration = async (bssData, gw) => {
    const timeNow = Date.now();
    const currentGw = bssData.events.find((e) => e.is_current);
    const nextGw = bssData.events.find((e) => e.is_next);
    const lastGw = bssData.events[bssData.events.length - 1];
    const MAX_EXPIRATION = (lastGw.deadline_time_epoch * 1000 - timeNow + 1000 * 60 * 60 * 24 * 60) /
        1000;
    if (gw < currentGw.id) {
        return MAX_EXPIRATION;
    }
    else if (gw !== currentGw.id)
        return 1;
    else if (currentGw.finished && currentGw.data_checked) {
        const timeNext = nextGw.deadline_time_epoch * 1000;
        const timeDiffNow = timeNext - timeNow;
        const timeMaxDiff = 1000 * 60 * 60 * 24 * 1;
        const returnTime = Math.min(timeDiffNow, timeMaxDiff) / 1000;
        return returnTime;
    }
    else {
        const fixturesUrl = `https://fantasy.premierleague.com/api/fixtures/?event=${gw}`;
        const fixturesReq = await fetch(fixturesUrl);
        const fixturesData = await fixturesReq.json();
        const lastGameKickOffTime = fixturesData[fixturesData.length - 1].kickoff_time;
        const lastGameKoEpoch = new Date(lastGameKickOffTime).getTime();
        const twoHours = 1000 * 60 * 60 * 2;
        const baseLine = lastGameKoEpoch + twoHours;
        if (timeNow < baseLine) {
            const diffToReturn = (baseLine - timeNow) / 1000;
            return diffToReturn;
        }
        else {
            return 60 * 5;
        }
    }
};
exports.getLeagueExpiration = getLeagueExpiration;
//# sourceMappingURL=expirations.js.map