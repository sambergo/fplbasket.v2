import { ArrowLeft, CircleUserRound, RefreshCw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import type { Context, League, Live } from "@fpl-basket/contracts";
import { ErrorPanel, LoadingPage, PageMotion } from "@/components/common";
import { PlayerEventBadges } from "@/components/PlayerEventBadges";
import { Button } from "@/components/ui/button";
import { useContextQuery, useLeagueQuery, useLiveQuery } from "@/hooks";
import { describePlayerEvent, eventDefinitions } from "@/player-events";
import { playerPhotoPlaceholderUrl, playerPhotoUrl } from "@/player-images";
import {
  defaultFixture,
  fixtureStatus,
  matchPlayers,
  sortedFixtures,
  type MatchPlayer,
} from "@/scores";

const dateLabel = (date?: string | null) =>
  date
    ? new Date(date).toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "Date to be confirmed";
const timeLabel = (date?: string | null) =>
  date
    ? new Date(date).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "TBC";
const eventsFor = (item: MatchPlayer) =>
  eventDefinitions.flatMap((definition) => {
    const count = item.stats
      .filter((stat) => stat.identifier === definition.identifier)
      .reduce((sum, stat) => sum + stat.value, 0);
    return count > 0 ? [{ ...definition, count }] : [];
  });

function OwnershipDialog({
  item,
  league,
  onClose,
}: {
  item: MatchPlayer | null;
  league: League;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (item) dialog.current?.showModal();
    else dialog.current?.close();
  }, [item]);
  return (
    <dialog
      ref={dialog}
      className="scores-owners"
      aria-labelledby="scores-owners-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {item && (
        <>
          <div className="scores-owners__heading">
            <div>
              <span className="scores-eyebrow">In your league</span>
              <h2 id="scores-owners-title">{item.player.web_name}</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close owners"
              onClick={onClose}
            >
              <X />
            </Button>
          </div>
          <p>Managers with this player in their active FPL picks.</p>
          <ul>
            {league.managers
              .filter((manager) =>
                manager.activePicks.some(
                  (pick) => pick.element === item.player.id,
                ),
              )
              .map((manager) => {
                const pick = manager.picks.find(
                  (pick) => pick.element === item.player.id,
                );
                return (
                  <li key={manager.entry}>
                    <Link
                      to={`/league/${league.league.id}/managers/${manager.entry}`}
                    >
                      {manager.playerName}
                      <small>{manager.teamName}</small>
                    </Link>
                    {pick?.is_captain && (
                      <span className="scores-captain">
                        {manager.activeChip === "3xc"
                          ? "Triple captain"
                          : "Captain"}
                      </span>
                    )}
                    {pick?.is_vice_captain && (
                      <span className="scores-captain">Vice-captain</span>
                    )}
                  </li>
                );
              })}
          </ul>
        </>
      )}
    </dialog>
  );
}

function MatchPlayerCard({
  item,
  league,
  onOwners,
  matchMinutes,
  substitute = false,
}: {
  item: MatchPlayer;
  league: League;
  onOwners: (item: MatchPlayer) => void;
  matchMinutes: number;
  substitute?: boolean;
}) {
  const events = eventsFor(item);
  const owners = league.managers.filter((manager) =>
    manager.activePicks.some((pick) => pick.element === item.player.id),
  ).length;
  if (substitute)
    return (
      <div className="scores-substitute">
        <Link
          className="scores-substitute__photo"
          to={`/league/${league.league.id}/players/${item.player.id}`}
          aria-label={`${item.player.web_name}, ${item.points} points${events.length ? `, ${events.map(describePlayerEvent).join(", ")}` : ""}`}
        >
          <img
            loading="lazy"
            src={playerPhotoUrl(item.player)}
            alt=""
            onError={(event) => {
              if (!event.currentTarget.src.endsWith("/placeholder.png"))
                event.currentTarget.src = playerPhotoPlaceholderUrl;
            }}
          />
        </Link>
        <span className="scores-substitute__details">
          <span className="scores-substitute__name">
            <Link to={`/league/${league.league.id}/players/${item.player.id}`}>
              <strong>{item.player.web_name}</strong>
            </Link>
            {owners > 0 && (
              <button
                className="scores-player__owners"
                onClick={() => onOwners(item)}
                aria-label={`Show ${owners} active owners of ${item.player.web_name}`}
              >
                <CircleUserRound aria-hidden="true" />
                {owners}
              </button>
            )}
          </span>
          <small>
            {item.minutes} min played
            {events.length
              ? ` · ${events.map(describePlayerEvent).join(" · ")}`
              : ""}
          </small>
        </span>
        <b>
          {item.points}
          <small>pts{item.provisionalBonus > 0 ? "*" : ""}</small>
        </b>
      </div>
    );
  return (
    <div className="scores-player">
      <Link
        className="scores-player__link"
        to={`/league/${league.league.id}/players/${item.player.id}`}
        aria-label={`${item.player.web_name}, ${item.points} points${item.minutes > 0 && item.minutes < matchMinutes ? `, substituted off after ${item.minutes} minutes` : ""}${events.length ? `, ${events.map(describePlayerEvent).join(", ")}` : ""}`}
      >
        <span className="scores-player__visual">
          {item.minutes > 0 && item.minutes < matchMinutes && (
            <span className="scores-player__subbed-off" title={`Substituted off after ${item.minutes} minutes`}>
              {item.minutes}′<span aria-hidden="true">←</span>
            </span>
          )}
          <img
            loading="lazy"
            src={playerPhotoUrl(item.player)}
            alt=""
            onError={(event) => {
              if (!event.currentTarget.src.endsWith("/placeholder.png"))
                event.currentTarget.src = playerPhotoPlaceholderUrl;
            }}
          />
          <PlayerEventBadges events={events} />
        </span>
        <span className="squad-player__label">
          <strong>{item.player.web_name}</strong>
          <small
            title={
              item.provisionalBonus
                ? `Includes ${item.provisionalBonus} provisional bonus points`
                : "FPL points in this match"
            }
          >
            {item.points}
            {item.provisionalBonus > 0 ? "*" : ""}
          </small>
        </span>
      </Link>
      {owners > 0 && (
        <button
          className="scores-player__owners"
          onClick={() => onOwners(item)}
          aria-label={`Show ${owners} active owners of ${item.player.web_name}`}
        >
          <CircleUserRound aria-hidden="true" />
          {owners}
        </button>
      )}
    </div>
  );
}

function TeamLineup({
  teamId,
  bench = false,
  away = false,
  context,
  live,
  fixture,
  league,
  onOwners,
}: {
  teamId: number;
  bench?: boolean;
  away?: boolean;
  context: Context;
  live: Live;
  fixture: Live["fixtures"][number];
  league: League;
  onOwners: (item: MatchPlayer) => void;
}) {
  const players = matchPlayers(context, live, fixture.id, teamId);
  const starters = players.filter((item) => item.starts === 1);
  const substitutes = players.filter(
    (item) => item.starts === 0 && item.minutes > 0,
  );
  const unknown = players.filter(
    (item) => item.starts == null && item.minutes > 0,
  );
  return (
    <section
      className={`scores-team${bench ? "" : " scores-pitch__half"}${away && !bench ? " scores-pitch__half--away" : ""}`}
      aria-label={`${context.teams.find((team) => team.id === teamId)?.name} ${bench ? "substitutes" : "players"}`}
    >
      <h3>{context.teams.find((team) => team.id === teamId)?.name}</h3>
      {!bench && (
        <>
          {!fixture.started || !starters.length ? (
            <div className="scores-pitch__empty">
              <CircleUserRound />
              <strong>
                {fixture.started
                  ? "Waiting for lineup data"
                  : "Lineup not available yet"}
              </strong>
              <p>
                {fixture.started
                  ? "The pitch will update when FPL reports who started."
                  : "Starting players will appear when FPL publishes match data."}
              </p>
            </div>
          ) : (
            <div className="scores-pitch__players">
              {(away ? [5, 4, 3, 2, 1] : [1, 2, 3, 4, 5]).map((position) => {
                const row = starters.filter(
                  (item) => item.player.element_type === position,
                );
                return (
                  row.length > 0 && (
                    <div className="scores-pitch__row" key={position}>
                      {row.map((item) => (
                        <MatchPlayerCard
                          key={item.player.id}
                          item={item}
                          league={league}
                          onOwners={onOwners}
                          matchMinutes={fixture.minutes ?? 90}
                        />
                      ))}
                    </div>
                  )
                );
              })}
            </div>
          )}
          {fixture.started && starters.length > 0 && starters.length !== 11 && (
            <p className="scores-note">
              Lineup data is still incomplete ({starters.length}/11).
            </p>
          )}
        </>
      )}
      {bench && (
        <>
          <div className="scores-subs">
            <h4>
              Substitutes used <span>{substitutes.length}</span>
            </h4>
            {substitutes.length > 0 ? (
              <div className="scores-subs__list">
                {substitutes.map((item) => (
                  <MatchPlayerCard
                    key={item.player.id}
                    item={item}
                    league={league}
                    onOwners={onOwners}
                    matchMinutes={fixture.minutes ?? 90}
                    substitute
                  />
                ))}
              </div>
            ) : (
              <p className="scores-note">No substitute appearances recorded.</p>
            )}
          </div>
          {unknown.length > 0 && (
            <div className="scores-subs">
              <h4>Awaiting lineup confirmation</h4>
              <div className="scores-subs__list">
                {unknown.map((item) => (
                  <MatchPlayerCard
                    key={item.player.id}
                    item={item}
                    league={league}
                    onOwners={onOwners}
                    matchMinutes={fixture.minutes ?? 90}
                    substitute
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function MatchDetail({
  context,
  live,
  league,
  fixture,
}: {
  context: Context;
  live: Live;
  league: League;
  fixture: Live["fixtures"][number];
}) {
  const [ownerItem, setOwnerItem] = useState<MatchPlayer | null>(null);
  const teams = [fixture.team_h, fixture.team_a];
  const teamName = (id: number) =>
    context.teams.find((team) => team.id === id)?.name ?? `Team ${id}`;
  const status = fixtureStatus(fixture);
  return (
    <article className="scores-detail">
      <header className="scores-match-header">
        <span
          className={`scores-status scores-status--${status.toLowerCase()}`}
        >
          {status === "Upcoming"
            ? `${dateLabel(fixture.kickoff_time)} · ${timeLabel(fixture.kickoff_time)}`
            : status}
        </span>
        <div>
          <h2>{teamName(fixture.team_h)}</h2>
          <strong>
            {fixture.started
              ? `${fixture.team_h_score ?? "–"} : ${fixture.team_a_score ?? "–"}`
              : "vs"}
          </strong>
          <h2>{teamName(fixture.team_a)}</h2>
        </div>
        {status !== "Upcoming" && (
          <small>
            {dateLabel(fixture.kickoff_time)} ·{" "}
            {timeLabel(fixture.kickoff_time)}
          </small>
        )}
      </header>
      <div className="squad-pitch scores-pitch">
        <div className="squad-pitch__penalty-area" aria-hidden="true" />
        <div
          className="squad-pitch__penalty-area scores-pitch__penalty-area--away"
          aria-hidden="true"
        />
        <div className="squad-pitch__halfway-line" aria-hidden="true" />
        <div className="squad-pitch__centre-circle" aria-hidden="true" />
        {teams.map((teamId) => (
          <TeamLineup
            key={teamId}
            teamId={teamId}
            away={teamId === fixture.team_a}
            context={context}
            live={live}
            fixture={fixture}
            league={league}
            onOwners={setOwnerItem}
          />
        ))}
      </div>
      <div className="scores-benches">
        {teams.map((teamId) => (
          <TeamLineup
            key={teamId}
            teamId={teamId}
            bench
            context={context}
            live={live}
            fixture={fixture}
            league={league}
            onOwners={setOwnerItem}
          />
        ))}
      </div>
      <OwnershipDialog
        item={ownerItem}
        league={league}
        onClose={() => setOwnerItem(null)}
      />
    </article>
  );
}

export function Scores() {
  const { leagueId = "" } = useParams();
  const context = useContextQuery();
  const league = useLeagueQuery(leagueId);
  const live = useLiveQuery(leagueId, true);
  const [search, setSearch] = useSearchParams();
  const fixtureId = search.get("fixture");
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches)
      window.scrollTo({ top: 0 });
  }, [fixtureId]);
  const isRefreshing =
    live.isFetching || league.isFetching || context.isFetching;
  if (!context.data || !league.data || !live.data) {
    const error = context.error ?? league.error ?? live.error;
    return error ? <ErrorPanel error={error} /> : <LoadingPage />;
  }
  const fixtures = sortedFixtures(live.data.fixtures);
  const requested = fixtures.find(
    (fixture) => String(fixture.id) === search.get("fixture"),
  );
  const selected = requested ?? defaultFixture(fixtures);
  const name = (teamId: number) =>
    context.data.teams.find((team) => team.id === teamId)?.name ??
    `Team ${teamId}`;
  const groups = new Map<string, Live["fixtures"]>();
  for (const fixture of fixtures) {
    const date = dateLabel(fixture.kickoff_time);
    groups.set(date, [...(groups.get(date) ?? []), fixture]);
  }
  return (
    <PageMotion>
      <div
        className={`league-page scores-page${requested ? " scores-page--selected" : ""}`}
      >
        <div className="scores-heading">
          <div>
            <span className="scores-eyebrow">Gameweek {live.data.eventId}</span>
            <h1>Scores</h1>
          </div>
          <div className="scores-refresh">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Refresh scores"
              disabled={isRefreshing}
              onClick={() => {
                void Promise.all([
                  live.refetch(),
                  league.refetch(),
                  context.refetch(),
                ]);
              }}
            >
              <RefreshCw className={isRefreshing ? "animate-spin" : ""} />
            </Button>
            {live.dataUpdatedAt > 0 && (
              <time dateTime={new Date(live.dataUpdatedAt).toISOString()}>
                Updated {new Date(live.dataUpdatedAt).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  hourCycle: "h23",
                })}
              </time>
            )}
          </div>
        </div>
        {!selected ? (
          <section className="overview-section">
            <p>No fixtures scheduled for this gameweek.</p>
          </section>
        ) : (
          <div className="scores-layout">
            <aside className="scores-list" aria-label="Gameweek fixtures">
              {[...groups].map(([date, matches]) => (
                <section key={date}>
                  <h2>{date}</h2>
                  {matches.map((fixture) => {
                    const status = fixtureStatus(fixture);
                    return (
                      <button
                        key={fixture.id}
                        className={`scores-fixture${selected.id === fixture.id ? " is-selected" : ""}`}
                        aria-pressed={selected.id === fixture.id}
                        aria-label={`${name(fixture.team_h)} versus ${name(fixture.team_a)}, ${status}`}
                        onClick={() =>
                          setSearch({ fixture: String(fixture.id) })
                        }
                      >
                        <span
                          className={`scores-status scores-status--${status.toLowerCase()}`}
                        >
                          {status === "Upcoming"
                            ? timeLabel(fixture.kickoff_time)
                            : status}
                        </span>
                        <span className="scores-fixture__teams">
                          <span>
                            {name(fixture.team_h)}
                            <strong>
                              {fixture.started
                                ? (fixture.team_h_score ?? "–")
                                : "–"}
                            </strong>
                          </span>
                          <span>
                            {name(fixture.team_a)}
                            <strong>
                              {fixture.started
                                ? (fixture.team_a_score ?? "–")
                                : "–"}
                            </strong>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </section>
              ))}
            </aside>
            <div className="scores-selected">
              <Button
                className="scores-back"
                variant="ghost"
                onClick={() => setSearch({})}
              >
                <ArrowLeft />
                Back to scores
              </Button>
              <MatchDetail
                key={selected.id}
                context={context.data}
                live={live.data}
                league={league.data}
                fixture={selected}
              />
            </div>
          </div>
        )}
      </div>
    </PageMotion>
  );
}
