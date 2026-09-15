import type { Manager } from "@fpl-basket/contracts";
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

    return (
      <Link
        className={`squad-player${isBench ? " squad-player--bench" : ""}`}
        key={pick.element}
        to={`/league/${leagueId}/players/${pick.element}`}
      >
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
          <strong>
            {item.web_name}
            {pick.is_captain ? " Ⓒ" : ""}
            {pick.is_vice_captain ? " Ⓥ" : ""}
          </strong>
          <small>{points(pick.element, pick.multiplier)}</small>
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
      <div className="overview-backdrop" aria-hidden="true" />
      <div className="league-page detail-page">
        <div className="detail-heading" ref={headingRef}>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft />
            Back
          </Button>
          <h1>{manager.playerName}</h1>
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

        <section className="overview-section manager-team-section">
          <div className="squad-pitch">
            <div className="squad-pitch__penalty-area" aria-hidden="true" />
            <div className="squad-pitch__halfway-line" aria-hidden="true" />
            <div className="squad-pitch__centre-circle" aria-hidden="true" />
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

          <div className="squad-totals">
            {manager.transferCost !== 0 && (
              <span>Transfers cost: {-manager.transferCost}</span>
            )}
            <strong>Total: {score?.gameweekPoints ?? "—"}</strong>
          </div>
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
