import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorPanel, LoadingPage, PageMotion } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useContextQuery, useLeagueQuery, useLiveQuery } from "@/hooks";

export function PlayerDetail() {
  const { leagueId = "", playerId = "" } = useParams();
  const navigate = useNavigate();
  const context = useContextQuery();
  const league = useLeagueQuery(leagueId);
  const live = useLiveQuery(leagueId);
  if (context.isPending || league.isPending || live.isPending) return <LoadingPage />;
  if (context.error || league.error || live.error) return <ErrorPanel error={(context.error ?? league.error ?? live.error)!} />;
  const id = Number(playerId);
  const player = context.data.players.find((item) => item.id === id);
  const livePlayer = live.data.players.find((item) => item.id === id);
  if (!player || !livePlayer) return <ErrorPanel error={new Error("Player not found in this gameweek")} />;
  const owners = league.data.ownership.find((item) => item.playerId === id)?.managerIds ?? [];
  const manager = (managerId: number) => league.data.managers.find((item) => item.entry === managerId)?.playerName ?? String(managerId);
  return <PageMotion><div className="overview-backdrop" aria-hidden="true" /><div className="league-page detail-page"><div className="detail-heading detail-heading--player"><Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft />Back</Button><h1>{player.first_name} {player.second_name}</h1><span /></div><section className="overview-section player-breakdown">{livePlayer.fixtures.map((fixture) => { const match = live.data.fixtures.find((item) => item.id === fixture.fixtureId); const home = context.data.teams.find((item) => item.id === match?.team_h)?.name; const away = context.data.teams.find((item) => item.id === match?.team_a)?.name; return <div key={fixture.fixtureId}><div className="fixture-heading"><h2>{home} – {away}</h2><span>Amount</span><span>Points</span></div><Table><TableBody>{fixture.stats.map((stat) => <TableRow key={stat.identifier}><TableCell className="capitalize">{stat.identifier.replaceAll("_", " ")}</TableCell><TableCell>{stat.value}</TableCell><TableCell>{stat.points}</TableCell></TableRow>)}</TableBody></Table></div>; })}<Table><TableBody><TableRow className="total-row"><TableCell>Total</TableCell><TableCell /><TableCell>{livePlayer.totalPoints}</TableCell></TableRow><TableRow><TableCell>Owned by</TableCell><TableCell colSpan={2} className="whitespace-normal text-[#bac2de]">{owners.map(manager).join(", ") || "—"}</TableCell></TableRow></TableBody></Table></section></div></PageMotion>;
}
