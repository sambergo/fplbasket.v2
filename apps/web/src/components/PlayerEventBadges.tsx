import type { CSSProperties } from "react";
import { describePlayerEvent, type PlayerEvent, type PlayerEventId } from "@/player-events";

function EventIcon({ identifier }: { identifier: PlayerEventId }) {
  const ball = (
    <>
      <circle cx="12" cy="12" r="10" fill="#fff" stroke="none" />
      <g fill="#20232b" stroke="none">
        <path d="m12 7 4.8 3.5-1.8 5.6H9l-1.8-5.6Z" />
        <path d="m8 2.8 4 2 4-2A10 10 0 0 0 8 2.8ZM2.2 10l3.6-2.1-.6-3.2A10 10 0 0 0 2.2 10Zm19.6 0-3.6-2.1.6-3.2a10 10 0 0 1 3 5.3ZM4.3 18.5l.8-4.2-3-1.5a10 10 0 0 0 2.2 5.7Zm15.4 0-.8-4.2 3-1.5a10 10 0 0 1-2.2 5.7ZM8.8 21.5 12 19l3.2 2.5a10 10 0 0 1-6.4 0Z" />
      </g>
      <path d="M12 4.5V7M5.5 7.5l1.7 3M18.5 7.5l-1.7 3M5 14.5 9 16m10-1.5L15 16m-3 0v3" stroke="#20232b" strokeWidth=".7" />
    </>
  );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {identifier === "yellow_cards" || identifier === "red_cards" ? (
        <rect x="6" y="3" width="12" height="18" rx="2" fill={identifier === "yellow_cards" ? "#f9e2af" : "#f38ba8"} stroke="none" />
      ) : identifier === "assists" ? (
        <>
          <g transform="rotate(-25 12 12)">
            <path d="M3 6h5l1 4 4 2 6 1q3 .5 3 4v1H2V9Z" fill="#fff" stroke="none" />
            <path d="M3 18h18M5 18v2m5-2v2m7-2v2m3-2v2" stroke="#fff" strokeWidth="1.8" />
            <path d="m10 10-1 3m4-2-1 3m4-2-1 3M3 15h4" stroke="#20232b" strokeWidth="1.2" />
          </g>
        </>
      ) : identifier === "penalties_saved" ? (
        <path d="M7 21v-4l-4-6q-1-3 1-3l4 4V5q0-3 2-2v7-7q2-3 3 0v7-6q2-2 3 0v7-4q2-2 3 0v8l-3 3v3Z" />
      ) : (
        <>
          {ball}
          {identifier === "own_goals" && <><rect x="2" y="8" width="20" height="10" rx="2" fill="#181825" stroke="none" /><text x="12" y="16" textAnchor="middle" fill="currentColor" stroke="none" fontSize="9" fontWeight="800">OG</text></>}
          {identifier === "penalties_missed" && <><circle cx="17" cy="17" r="7" fill="#181825" stroke="none" /><path d="m14 14 6 6m0-6-6 6" stroke="#f38ba8" strokeWidth="2.5" /></>}
        </>
      )}
    </svg>
  );
}

export function PlayerEventBadges({ events }: { events: PlayerEvent[] }) {
  if (!events.length) return null;
  return (
    <span className="player-events" aria-hidden="true">
      {(["left", "right"] as const).map((side) => {
        const badges = events.filter((event) => (event.identifier === "assists") === (side === "left"));
        if (!badges.length) return null;
        return (
          <span className={`player-events__side player-events__side--${side}${badges.length > 3 ? " player-events__side--many" : ""}`} key={side}>
            {badges.map((event) => (
              event.identifier === "goals_scored" ? (
                <span className="player-event-goals" key={event.identifier} title={describePlayerEvent(event)} style={{ "--goal-row-width": `calc(var(--event-size) + ${(event.count - 1) * .6}rem)`, minWidth: `calc(var(--event-size) + ${Math.min(event.count - 1, 2) * .4}rem)`, gridTemplateColumns: `${event.count > 1 ? `repeat(${event.count - 1}, minmax(0, 1fr)) ` : ""}var(--event-size)` } as CSSProperties}>
                  {Array.from({ length: event.count }, (_, index) => (
                    <span className="player-event" key={index}><EventIcon identifier={event.identifier} /></span>
                  ))}
                </span>
              ) : <span className="player-event" key={event.identifier} title={describePlayerEvent(event)}>
                <EventIcon identifier={event.identifier} />
                {event.count > 1 && <span className="player-event__count">×{event.count}</span>}
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
}
