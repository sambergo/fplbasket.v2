"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParsedLive = void 0;
const getParsedLive = (elements, fixtures) => {
    fixtures.forEach((fixture) => {
        const hasBonus = fixture.stats.some((s) => s.identifier === "bonus" && [...s.a, ...s.h].length > 0) || fixture.finished;
        if (hasBonus)
            return;
        else {
            const bps = fixture.stats.find((s) => s.identifier === "bps");
            if (!bps)
                return;
            let homeAndAway = [...bps.h, ...bps.a];
            let bonusLeft = 3;
            while (bonusLeft > 0) {
                const maxBps = Math.max(...homeAndAway.map((ha) => ha.value));
                const sameAsMax = homeAndAway.filter((element) => element.value === maxBps);
                homeAndAway = homeAndAway.filter((haw) => haw.value !== maxBps);
                sameAsMax.forEach((samObj) => {
                    const i = samObj.element;
                    const e = elements[i].explain.findIndex((e) => e.fixture === fixture.id);
                    const stats = elements[i].explain[e].stats.concat({
                        identifier: "live_bonus",
                        points: bonusLeft,
                        value: bonusLeft,
                    });
                    elements[i].explain[e].stats = stats;
                    elements[i].stats.total_points += bonusLeft;
                    elements[i].live_bps = bonusLeft;
                });
                bonusLeft -= sameAsMax.length;
            }
        }
    });
    return elements;
};
exports.getParsedLive = getParsedLive;
//# sourceMappingURL=getParsedLive.js.map