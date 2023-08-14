"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBssDataFromFpl = void 0;
const superagent_1 = __importDefault(require("superagent"));
const fetchBssDataFromFpl = async () => {
    const bootstrap_static = await superagent_1.default.get(`https://fantasy.premierleague.com/api/bootstrap-static/`);
    const fpldata = bootstrap_static.body;
    let elements = [];
    fpldata.elements.forEach((element) => {
        elements[element.id] = element;
    });
    fpldata.elements = elements;
    return fpldata;
};
exports.fetchBssDataFromFpl = fetchBssDataFromFpl;
//# sourceMappingURL=fetchBssData.js.map