"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBssDataFromFpl = void 0;
const axios_1 = __importDefault(require("axios"));
const fetchBssDataFromFpl = async () => {
    try {
        const { data: fplData } = await axios_1.default.get('https://fantasy.premierleague.com/api/bootstrap-static/', {
            timeout: 2000
        });
        let elements = [];
        fplData.elements.forEach((element) => {
            elements[element.id] = element;
        });
        fplData.elements = elements;
        return fplData;
    }
    catch (error) {
        console.error(error);
        throw new Error(error);
    }
};
exports.fetchBssDataFromFpl = fetchBssDataFromFpl;
//# sourceMappingURL=fetchBssData.js.map