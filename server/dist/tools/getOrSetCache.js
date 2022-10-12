"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrSetCache = void 0;
const redisConnection_1 = require("../tools/redisConnection");
const getOrSetCache = async (redisKey, cb, params = null) => {
    return new Promise((resolve, reject) => {
        redisConnection_1.redisClient.get(redisKey, async (error, data) => {
            if (error)
                return reject(error);
            if (data)
                return resolve(JSON.parse(data));
            try {
                console.log("fetching fresh data");
                const { freshData, ex } = await cb(params);
                if (freshData && ex)
                    redisConnection_1.redisClient.setex(redisKey, parseInt(ex), JSON.stringify(freshData));
                resolve(freshData);
            }
            catch (error) {
                reject(error);
            }
        });
    });
};
exports.getOrSetCache = getOrSetCache;
//# sourceMappingURL=getOrSetCache.js.map