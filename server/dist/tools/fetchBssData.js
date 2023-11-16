"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBssDataFromFpl = void 0;
const fetchBssDataFromFpl = async () => {
    try {
        const bootstrapStatic = await fetch(`https://fantasy.premierleague.com/api/bootstrap-static/`);
        const fplData = await bootstrapStatic.json();
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