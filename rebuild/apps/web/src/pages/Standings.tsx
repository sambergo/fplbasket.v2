import type { ColumnDef } from "@tanstack/react-table";
import type { Live } from "@fpl-basket/contracts";
import { ArrowDown, ArrowUp, Circle, RefreshCw, Rocket } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataTable } from "@/components/DataTable";
import { ErrorPanel, LoadingPage, PageMotion, Refreshing } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useLeagueQuery, useLiveQuery } from "@/hooks";

type Row = Live["standings"][number];
export function Standings() {
  const { leagueId = "" } = useParams();
  const navigate = useNavigate();
  const league = useLeagueQuery(leagueId);
  const live = useLiveQuery(leagueId);
  const [showBonus, setShowBonus] = useState(() => localStorage.getItem("fpl-basket:live-bonus") !== "false");
  if (league.isPending || live.isPending) return <LoadingPage />;
  if (league.error || live.error) return <ErrorPanel error={(league.error ?? live.error)!} retry={() => { league.refetch(); live.refetch(); }} />;
  const managers = new Map(league.data.managers.map((manager) => [manager.entry, manager]));
  const adjusted = live.data.standings.map((row) => {
    const manager = managers.get(row.managerId)!;
    const bonus = manager.activePicks.reduce((sum, pick) => sum + (live.data.players.find((item) => item.id === pick.element)?.provisionalBonus ?? 0) * pick.multiplier, 0);
    return showBonus ? row : { ...row, gameweekPoints: row.gameweekPoints - bonus, totalPoints: row.totalPoints - bonus };
  }).sort((a, b) => b.totalPoints - a.totalPoints).map((row, index) => ({ ...row, rank: index + 1 }));
  const columns: ColumnDef<Row>[] = [
    { accessorKey: "rank", header: "Rank", enableSorting: false, cell: ({ row }) => { const diff = row.original.previousRank - row.original.rank; return <span className="inline-flex items-center gap-1 font-bold">{row.original.rank}{diff > 3 ? <Rocket aria-label={`Up ${diff} places`} className="size-4 text-[#cba6f7]" /> : diff > 0 ? <ArrowUp aria-label={`Up ${diff} places`} className="size-4 text-[#a6e3a1]" /> : diff < 0 ? <ArrowDown aria-label={`Down ${Math.abs(diff)} places`} className="size-4 text-[#f38ba8]" /> : <Circle aria-label="No rank change" className="size-2 fill-[#6c7086] text-[#6c7086]" />}</span>; } },
    { accessorFn: (row) => managers.get(row.managerId)?.teamName, id: "team", header: "Team", enableSorting: false, cell: ({ row }) => <div><div className="font-semibold">{managers.get(row.original.managerId)?.teamName}</div><div className="text-xs text-[#a6adc8]">{managers.get(row.original.managerId)?.playerName}</div></div> },
    { accessorKey: "remaining", header: "🏇", enableSorting: false, cell: ({ row }) => <span>{row.original.remaining}{row.original.playing ? <span className="standings-live ml-1 text-[#a6e3a1]">· {row.original.playing}<span className="standings-live__label"> live</span></span> : null}</span> },
    { accessorKey: "gameweekPoints", header: "GW / Tot", enableSorting: false, cell: ({ row }) => <span className="block text-right font-bold"><span className="block">{row.original.gameweekPoints}</span><span className="block text-xs font-medium text-[#a6adc8]">{row.original.totalPoints}</span></span> },
  ];
  const average = adjusted.reduce((sum, row) => sum + row.gameweekPoints, 0) / Math.max(adjusted.length, 1);
  return <PageMotion><div className="league-page"><section className="overview-section standings-section"><div className="standings-heading"><label><Switch checked={showBonus} onCheckedChange={(value) => { setShowBonus(value); localStorage.setItem("fpl-basket:live-bonus", String(value)); }} /><span>Bonus</span></label><h2>Standings</h2><Button aria-label="Refresh standings" variant="ghost" size="icon" onClick={() => live.refetch()} disabled={live.isFetching}><RefreshCw className={live.isFetching ? "size-5 animate-spin" : "size-5"} /></Button></div>{live.isFetching && <div className="px-5 pb-2"><Refreshing /></div>}<DataTable data={adjusted} columns={columns} onRowClick={(row) => navigate(`/league/${leagueId}/managers/${row.managerId}`)} /><div className="average-row"><span>Average</span><strong>{average.toFixed(2)}</strong></div></section></div></PageMotion>;
}
