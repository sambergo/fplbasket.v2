"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreviousGwOrNull = void 0;
const getPreviousGwOrNull = (gw) => {
    if (parseInt(gw) > 1)
        return (parseInt(gw) - 1).toString();
    else
        return null;
};
exports.getPreviousGwOrNull = getPreviousGwOrNull;
//# sourceMappingURL=helpers.js.map