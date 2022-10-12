"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrSetCache = void 0;
const getOrSetCache = async (redisKey, cb, params = null) => {
    console.log(redisKey);
    const { freshData, ex } = await cb(params);
    console.log("ex:", ex);
    return freshData;
};
exports.getOrSetCache = getOrSetCache;
//# sourceMappingURL=getOrSetCache.js.map