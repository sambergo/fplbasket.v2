import type { Manager } from "@fpl-basket/contracts";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ErrorPanel, LoadingPage, PageMotion } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useContextQuery, useLeagueQuery, useLiveQuery } from "@/hooks";

const position = (value: number) => ["", "GKP", "DEF", "MID", "FWD", "MNG"][value] ?? "";
const chipName = (name: string) => name.replace("3xc", "Triple captain").replace("bboost", "Bench boost").replace("freehit", "Free hit");

export function ManagerDetail() {
  const { leagueId = "", managerId = "" } = useParams();
  const navigate = useNavigate();
  const league = useLeagueQuery(leagueId);
  const context = useContextQuery();
  const live = useLiveQuery(leagueId);
  const [compareId, setCompareId] = useState("");
  if (league.isPending || context.isPending || live.isPending) return <LoadingPage />;
  if (league.error || context.error || live.error) return <ErrorPanel error={(league.error ?? context.error ?? live.error)!} />;
  const manager = league.data.managers.find((item) => item.entry === Number(managerId));
  if (!manager) return <ErrorPanel error={new Error("Manager not found in this league")} />;
  const score = live.data.standings.find((item) => item.managerId === manager.entry);
  const player = (id: number) => context.data.players.find((item) => item.id === id);
  const team = (id: number) => context.data.teams.find((item) => item.id === id)?.short_name;
  const points = (id: number, multiplier: number) => (live.data.players.find((item) => item.id === id)?.totalPoints ?? 0) * multiplier;
  const squad = (title: string, picks: Manager["picks"]) => <section className="overview-section manager-squad-section"><div className="overview-section__heading"><h2>{title}</h2></div><Table><TableHeader><TableRow><TableHead>Player</TableHead><TableHead>Team</TableHead><TableHead>Position</TableHead><TableHead>Points</TableHead></TableRow></TableHeader><TableBody>{picks.map((pick) => { const item = player(pick.element); return <TableRow key={pick.element}><TableCell><Link className="font-semibold text-[#cdd6f4]" to={`/league/${leagueId}/players/${pick.element}`}>{item?.web_name ?? pick.element}</Link>{pick.is_captain ? " Ⓒ" : ""}{pick.is_vice_captain ? " Ⓥ" : ""}</TableCell><TableCell>{item ? team(item.team) : "—"}</TableCell><TableCell>{item ? position(item.element_type) : "—"}</TableCell><TableCell className="font-bold">{points(pick.element, pick.multiplier)}</TableCell></TableRow>; })}{title === "Team" && manager.transferCost !== 0 && <TableRow><TableCell>Transfers cost</TableCell><TableCell /><TableCell /><TableCell>{-manager.transferCost}</TableCell></TableRow>}{title === "Team" && <TableRow className="total-row"><TableCell>Total</TableCell><TableCell /><TableCell /><TableCell>{score?.gameweekPoints ?? "—"}</TableCell></TableRow>}</TableBody></Table></section>;
  const enemy = league.data.managers.find((item) => item.entry === Number(compareId));
  const activeIds = (item: Manager) => item.activePicks.map((pick) => pick.element);
  const names = (ids: number[]) => ids.map((id) => player(id)?.web_name ?? id).join(", ") || "—";
  return <PageMotion><div className="overview-backdrop" aria-hidden="true" /><div className="league-page detail-page"><div className="detail-heading"><Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft />Back</Button><h1>{manager.playerName}</h1><Button asChild variant="ghost"><a href={`https://fantasy.premierleague.com/entry/${manager.entry}/event/${league.data.event.id}/`} target="_blank" rel="noreferrer">FPL <ExternalLink /></a></Button></div>{squad("Team", manager.picks.filter((pick) => pick.multiplier > 0))}{squad("Bench", manager.picks.filter((pick) => pick.multiplier === 0))}<section className="overview-section manager-chips-section"><div className="overview-section__heading"><h2>Chips used</h2></div><Table><TableHeader><TableRow><TableHead>GW</TableHead><TableHead>Chip</TableHead></TableRow></TableHeader><TableBody>{manager.chips.map((chip) => <TableRow key={`${chip.event}-${chip.name}`} className={chip.event === league.data.event.id ? "current-chip" : ""}><TableCell>{chip.event}</TableCell><TableCell className="capitalize">{chipName(chip.name)}</TableCell></TableRow>)}</TableBody></Table>{!manager.chips.length && <p className="empty-copy">No chips used yet.</p>}</section><section className="overview-section compare-section"><div className="overview-section__heading"><h2>Compare to</h2></div><div className="compare-select-wrap"><label htmlFor="compare-manager">Select another manager</label><select id="compare-manager" value={compareId} onChange={(event) => setCompareId(event.target.value)}><option value="">Select manager</option>{league.data.managers.filter((item) => item.entry !== manager.entry).map((item) => <option key={item.entry} value={item.entry}>{item.playerName}</option>)}</select></div>{enemy && <div className="compare-grid"><div><h3>{manager.playerName}</h3><p>{names(activeIds(manager).filter((id) => !activeIds(enemy).includes(id)))}</p></div><div><h3>{enemy.playerName}</h3><p>{names(activeIds(enemy).filter((id) => !activeIds(manager).includes(id)))}</p></div><div><h3>Mutual</h3><p>{names(activeIds(manager).filter((id) => activeIds(enemy).includes(id)))}</p></div></div>}</section></div></PageMotion>;
}
