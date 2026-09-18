import type { Context, Live, Manager } from "@fpl-basket/contracts";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ErrorPanel, LoadingPage, PageMotion } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContextQuery, useLeagueQuery, useLiveQuery } from "@/hooks";

const position = (value: number) =>
  ["", "GKP", "DEF", "MID", "FWD", "MNG"][value] ?? "";

const chipName = (name: string) =>
  name
    .replace("3xc", "Triple captain")
    .replace("bboost", "Bench boost")
    .replace("freehit", "Free hit");

const shirtUrl = (teamCode: number, isGoalkeeper: boolean) => {
  const goalkeeperVariant = isGoalkeeper ? "_1" : "";
  return `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${teamCode}${goalkeeperVariant}-110.webp`;
};

type PlayerStatus = "played" | "live" | "upcoming";

export const playerStatus = (
  teamId: number,
  fixtures: Live["fixtures"],
): PlayerStatus => {
  const teamFixtures = fixtures.filter(
    (fixture) => fixture.team_h === teamId || fixture.team_a === teamId,
  );

  if (
    teamFixtures.some(
      (fixture) => fixture.started && !fixture.finished_provisional,
    )
  )
    return "live";
  if (teamFixtures.some((fixture) => !fixture.started)) return "upcoming";
  return "played";
};

export const upcomingOpponent = (
  teamId: number,
  fixtures: Live["fixtures"],
  teams: Context["teams"],
) => {
  const fixture = fixtures
    .filter(
      (item) =>
        !item.started && (item.team_h === teamId || item.team_a === teamId),
    )
    .sort((a, b) => {
      const aKickoff = Date.parse(a.kickoff_time ?? "");
      const bKickoff = Date.parse(b.kickoff_time ?? "");
      return (
        (Number.isNaN(aKickoff) ? Number.POSITIVE_INFINITY : aKickoff) -
        (Number.isNaN(bKickoff) ? Number.POSITIVE_INFINITY : bKickoff)
      );
    })[0];

  if (!fixture) return null;

  const isHome = fixture.team_h === teamId;
  const opponentId = isHome ? fixture.team_a : fixture.team_h;
  const opponent = teams.find((team) => team.id === opponentId)?.short_name;
  return opponent ? `${opponent} (${isHome ? "H" : "A"})` : null;
};

const statusLabel: Record<PlayerStatus, string> = {
  played: "Played",
  live: "Live",
  upcoming: "Still to play",
};

export function ManagerDetail() {
  const { leagueId = "", managerId = "" } = useParams();
  const navigate = useNavigate();
  const league = useLeagueQuery(leagueId);
  const context = useContextQuery();
  const live = useLiveQuery(leagueId);
  const [compareId, setCompareId] = useState("");
  const headingRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (league.isPending || context.isPending || live.isPending) return;

    if (window.matchMedia("(max-width: 620px)").matches && headingRef.current) {
      const headingTop =
        window.scrollY + headingRef.current.getBoundingClientRect().top;
      window.scrollTo({ top: Math.max(headingTop - 8, 0) });
      return;
    }

    window.scrollTo({ top: 0 });
  }, [managerId, league.isPending, context.isPending, live.isPending]);

  if (league.isPending || context.isPending || live.isPending)
    return <LoadingPage />;
  if (league.error || context.error || live.error)
    return (
      <ErrorPanel error={(league.error ?? context.error ?? live.error)!} />
    );

  const manager = league.data.managers.find(
    (item) => item.entry === Number(managerId),
  );
  if (!manager)
    return (
      <ErrorPanel error={new Error("Manager not found in this league")} />
    );

  const score = live.data.standings.find(
    (item) => item.managerId === manager.entry,
  );
  const player = (id: number) =>
    context.data.players.find((item) => item.id === id);
  const points = (id: number, multiplier: number) =>
    (live.data.players.find((item) => item.id === id)?.totalPoints ?? 0) *
    multiplier;
  const activePicks = manager.picks.filter((pick) => pick.multiplier > 0);
  const benchPicks = manager.picks.filter((pick) => pick.multiplier === 0);
  const positionRows = [1, 2, 3, 4, 5]
    .map((elementType) =>
      activePicks.filter(
        (pick) => player(pick.element)?.element_type === elementType,
      ),
    )
    .filter((row) => row.length > 0);

  const playerCard = (pick: Manager["picks"][number], isBench = false) => {
    const item = player(pick.element);
    if (!item) return null;
    const status = playerStatus(item.team, live.data.fixtures);
    const playerPoints = points(pick.element, pick.multiplier);
    const opponent = upcomingOpponent(
      item.team,
      live.data.fixtures,
      context.data.teams,
    );
    const cardValue = status === "upcoming" && opponent ? opponent : playerPoints;
    const cardDescription =
      status === "upcoming" && opponent
        ? `${statusLabel[status]}, ${opponent}`
        : `${statusLabel[status]}, ${playerPoints} points`;
    const captaincy = pick.is_captain
      ? "Captain"
      : pick.is_vice_captain
        ? "Vice-captain"
        : null;

    return (
      <Link
        className={`squad-player squad-player--${status}${isBench ? " squad-player--bench" : ""}`}
        key={pick.element}
        to={`/league/${leagueId}/players/${pick.element}`}
        aria-label={`${item.web_name}${captaincy ? `, ${captaincy}` : ""}, ${cardDescription}`}
        title={statusLabel[status]}
      >
        {captaincy && (
          <span className="squad-player__captain" aria-hidden="true">
            {pick.is_captain ? "C" : "V"}
          </span>
        )}
        {item.team_code !== undefined ? (
          <img
            className="squad-player__shirt"
            src={shirtUrl(item.team_code, item.element_type === 1)}
            alt=""
          />
        ) : (
          <span className="squad-player__shirt" />
        )}
        <span className="squad-player__label">
          <strong>{item.web_name}</strong>
          <small>{cardValue}</small>
        </span>
        {isBench && (
          <span className="squad-player__position">
            {position(item.element_type)}
          </span>
        )}
      </Link>
    );
  };

  const enemy = league.data.managers.find(
    (item) => item.entry === Number(compareId),
  );
  const activeIds = (item: Manager) =>
    item.activePicks.map((pick) => pick.element);
  const names = (ids: number[]) =>
    ids.map((id) => player(id)?.web_name ?? id).join(", ") || "—";

  return (
    <PageMotion>
      <div className="league-page detail-page">
        <section className="overview-section manager-team-section">
          <div className="detail-heading detail-heading--manager" ref={headingRef}>
            <Button
              variant="ghost"
              onClick={() => navigate(`/league/${leagueId}/standings`)}
            >
              <ArrowLeft />
              Back
            </Button>
            <div className="detail-heading__identity">
              <h1>{manager.teamName}</h1>
              <p>{manager.playerName}</p>
            </div>
            <Button asChild variant="ghost">
              <a
                href={`https://fantasy.premierleague.com/entry/${manager.entry}/event/${league.data.event.id}/`}
                target="_blank"
                rel="noreferrer"
              >
                FPL <ExternalLink />
              </a>
            </Button>
          </div>

          <div className="squad-pitch">
            <div className="squad-pitch__penalty-area" aria-hidden="true" />
            <div className="squad-pitch__halfway-line" aria-hidden="true" />
            <div className="squad-pitch__centre-circle" aria-hidden="true" />
            {manager.activeChip && (
              <span className="squad-pitch__badge squad-pitch__badge--chip">
                {chipName(manager.activeChip)}
              </span>
            )}
            <strong className="squad-pitch__badge squad-pitch__badge--points">
              Total: {score?.gameweekPoints ?? "—"}
            </strong>
            <div className="squad-pitch__players">
              {positionRows.map((row, rowIndex) => (
                <div
                  className="squad-pitch__row"
                  key={player(row[0]?.element ?? 0)?.element_type ?? rowIndex}
                >
                  {row.map((pick) => playerCard(pick))}
                </div>
              ))}
            </div>
          </div>

          <div className="squad-bench">
            <h2>Bench</h2>
            <div className="squad-bench__players">
              {benchPicks.map((pick) => playerCard(pick, true))}
            </div>
          </div>

          {manager.transferCost !== 0 && (
            <div className="squad-totals">
              <span>Transfers cost: {-manager.transferCost}</span>
            </div>
          )}
        </section>

        <section className="overview-section manager-chips-section">
          <div className="overview-section__heading">
            <h2>Chips used</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>GW</TableHead>
                <TableHead>Chip</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manager.chips.map((chip) => (
                <TableRow
                  key={`${chip.event}-${chip.name}`}
                  className={
                    chip.event === league.data.event.id ? "current-chip" : ""
                  }
                >
                  <TableCell>{chip.event}</TableCell>
                  <TableCell className="capitalize">
                    {chipName(chip.name)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!manager.chips.length && (
            <p className="empty-copy">No chips used yet.</p>
          )}
        </section>

        <section className="overview-section compare-section">
          <div className="overview-section__heading">
            <h2>Compare to</h2>
          </div>
          <div className="compare-select-wrap">
            <label htmlFor="compare-manager">Select another manager</label>
            <select
              id="compare-manager"
              value={compareId}
              onChange={(event) => setCompareId(event.target.value)}
            >
              <option value="">Select manager</option>
              {league.data.managers
                .filter((item) => item.entry !== manager.entry)
                .map((item) => (
                  <option key={item.entry} value={item.entry}>
                    {item.playerName}
                  </option>
                ))}
            </select>
          </div>
          {enemy && (
            <div className="compare-grid">
              <div>
                <h3>{manager.playerName}</h3>
                <p>
                  {names(
                    activeIds(manager).filter(
                      (id) => !activeIds(enemy).includes(id),
                    ),
                  )}
                </p>
              </div>
              <div>
                <h3>{enemy.playerName}</h3>
                <p>
                  {names(
                    activeIds(enemy).filter(
                      (id) => !activeIds(manager).includes(id),
                    ),
                  )}
                </p>
              </div>
              <div>
                <h3>Mutual</h3>
                <p>
                  {names(
                    activeIds(manager).filter((id) =>
                      activeIds(enemy).includes(id),
                    ),
                  )}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </PageMotion>
  );
}
