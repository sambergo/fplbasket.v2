import type { Live } from "@fpl-basket/contracts";

export const eventDefinitions = [
  { identifier: "goals_scored", label: "Goal", plural: "goals" },
  { identifier: "assists", label: "Assist", plural: "assists" },
  { identifier: "yellow_cards", label: "Yellow card", plural: "yellow cards" },
  { identifier: "red_cards", label: "Red card", plural: "red cards" },
  { identifier: "own_goals", label: "Own goal", plural: "own goals" },
  { identifier: "penalties_missed", label: "Penalty missed", plural: "penalties missed" },
  { identifier: "penalties_saved", label: "Penalty saved", plural: "penalties saved" },
] as const;

export type PlayerEvent = (typeof eventDefinitions)[number] & { count: number };
export type PlayerEventId = PlayerEvent["identifier"];

export function playerEvents(player: Live["players"][number] | undefined): PlayerEvent[] {
  const totals = new Map<string, number>();
  for (const fixture of player?.fixtures ?? []) {
    for (const stat of fixture.stats) {
      totals.set(stat.identifier, (totals.get(stat.identifier) ?? 0) + stat.value);
    }
  }
  return eventDefinitions.flatMap((event) => {
    const count = totals.get(event.identifier) ?? 0;
    return count > 0 ? [{ ...event, count }] : [];
  });
}

export const describePlayerEvent = (event: PlayerEvent) =>
  `${event.count} ${event.count === 1 ? event.label.toLowerCase() : event.plural}`;
