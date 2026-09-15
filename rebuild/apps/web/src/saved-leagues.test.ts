import { beforeEach, describe, expect, it } from "vitest";
import {
  getSavedLeagues,
  removeSavedLeague,
  saveLeague,
} from "./saved-leagues";

const storageKey = "fpl-basket:saved-leagues:v1";

describe("saved leagues", () => {
  beforeEach(() => localStorage.clear());

  it("recovers from malformed and invalid stored data", () => {
    localStorage.setItem(storageKey, "not json");
    expect(getSavedLeagues()).toEqual([]);

    localStorage.setItem(
      storageKey,
      JSON.stringify([
        { id: 1, name: "Valid", lastViewedAt: 10 },
        { id: 0, name: "Invalid", lastViewedAt: 20 },
        { id: 2, name: "", lastViewedAt: 30 },
      ]),
    );
    expect(getSavedLeagues()).toEqual([
      { id: 1, name: "Valid", lastViewedAt: 10 },
    ]);
  });

  it("deduplicates, orders, and limits leagues to five", () => {
    for (let id = 1; id <= 6; id += 1) {
      saveLeague({ id, name: `League ${id}` }, id);
    }
    saveLeague({ id: 3, name: "League three" }, 10);

    expect(getSavedLeagues()).toEqual([
      { id: 3, name: "League three", lastViewedAt: 10 },
      { id: 6, name: "League 6", lastViewedAt: 6 },
      { id: 5, name: "League 5", lastViewedAt: 5 },
      { id: 4, name: "League 4", lastViewedAt: 4 },
      { id: 2, name: "League 2", lastViewedAt: 2 },
    ]);
  });

  it("removes one league", () => {
    saveLeague({ id: 7, name: "Saved league" }, 1);
    expect(removeSavedLeague(7)).toEqual([]);
  });
});
