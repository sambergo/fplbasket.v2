import { Fixtures } from "src/types/fixtures";
import { LiveElement } from "src/types/liveElements";

export const getParsedLive = (
  elements: LiveElement[],
  fixtures: Fixtures[]
): LiveElement[] => {
  fixtures.forEach((fixture) => {
    const hasBonus =
      fixture.stats.some(
        (s) => s.identifier === "bonus" && [...s.a, ...s.h].length > 0
      ) || fixture.finished;
    if (hasBonus) return;
    else {
      const bps = fixture.stats.find((s) => s.identifier === "bps");
      if (!bps) return;
      let homeAndAway = [...bps.h, ...bps.a];
      let bonusLeft = 3;
      while (bonusLeft > 0) {
        const maxBps = Math.max(...homeAndAway.map((ha) => ha.value));
        const sameAsMax = homeAndAway.filter(
          (element) => element.value === maxBps
        );
        homeAndAway = homeAndAway.filter((haw) => haw.value !== maxBps);
        sameAsMax.forEach((samObj) => {
          elements[samObj.element].live_bps = bonusLeft;
        });
        bonusLeft -= sameAsMax.length;
      }
    }
  });
  return elements;
};
