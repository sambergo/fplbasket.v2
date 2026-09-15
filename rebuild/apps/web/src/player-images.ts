import type { Player } from "@fpl-basket/contracts";

const PLAYER_PHOTO_BASE =
  "https://resources.premierleague.com/premierleague25/photos/players/110x140";

export const playerPhotoPlaceholderUrl = `${PLAYER_PHOTO_BASE}/placeholder.png`;

export function playerPhotoUrl(
  player: Pick<Player, "code" | "has_temporary_code">,
) {
  if (!player.code || player.has_temporary_code) {
    return playerPhotoPlaceholderUrl;
  }

  return `${PLAYER_PHOTO_BASE}/${player.code}.png`;
}
