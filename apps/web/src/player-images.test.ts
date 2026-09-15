import { describe, expect, it } from "vitest";
import { playerPhotoPlaceholderUrl, playerPhotoUrl } from "./player-images";

describe("playerPhotoUrl", () => {
  it("uses the current portrait keyed by player code", () => {
    expect(playerPhotoUrl({ code: 223094 })).toBe(
      "https://resources.premierleague.com/premierleague25/photos/players/110x140/223094.png",
    );
  });

  it("uses the official placeholder for temporary or missing codes", () => {
    expect(playerPhotoUrl({ code: 223094, has_temporary_code: true })).toBe(
      playerPhotoPlaceholderUrl,
    );
    expect(playerPhotoUrl({})).toBe(playerPhotoPlaceholderUrl);
  });
});
