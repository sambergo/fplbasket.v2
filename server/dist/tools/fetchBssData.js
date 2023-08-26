"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBssDataFromFpl = void 0;
const superagent_1 = __importDefault(require("superagent"));
const fetchBssDataFromFpl = async () => {
    try {
        const bootstrapStatic = await superagent_1.default.get(`https://fantasy.premierleague.com/api/bootstrap-static/`);
        const fplData = bootstrapStatic.body;
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