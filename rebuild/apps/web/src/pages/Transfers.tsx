import type { DataTableColumnDef } from "@/components/DataTable";
import type { League } from "@fpl-basket/contracts";
import { Link, useParams } from "react-router-dom";
import { DataTable } from "@/components/DataTable";
import { ErrorPanel, LoadingPage, PageMotion } from "@/components/common";
import { useContextQuery, useLeagueQuery } from "@/hooks";

type Row = League["transfers"][number];

export function Transfers() {
  const { leagueId = "" } = useParams();
  const league = useLeagueQuery(leagueId);
  const context = useContextQuery();
  if (league.isPending || context.isPending) return <LoadingPage />;
  if (league.error || context.error) return <ErrorPanel error={(league.error ?? context.error)!} retry={() => { league.refetch(); context.refetch(); }} />;
  const player = (id: number) => context.data.players.find((item) => item.id === id)?.web_name ?? String(id);
  const manager = (id: number) => league.data.managers.find((item) => item.entry === id)?.playerName ?? String(id);
  const chip = (value: string | null) => value === "freehit" ? "*Free hit*" : value === "wildcard" ? "*Wildcard*" : null;
  const playerLinks = (playerIds: number[]) => playerIds.map((playerId, index) => (
    <span key={`${playerId}-${index}`}>
      {index > 0 && ", "}
      <Link className="entity-link" to={`/league/${leagueId}/players/${playerId}`}>{player(playerId)}</Link>
    </span>
  ));
  const columns: DataTableColumnDef<Row>[] = [
    { accessorFn: (row) => manager(row.managerId), id: "manager", header: "Manager", enableSorting: false, cell: ({ row }) => <Link className="entity-link" to={`/league/${leagueId}/managers/${row.original.managerId}`}>{manager(row.original.managerId)}</Link> },
    { accessorFn: (row) => chip(row.chip) ?? row.transfersIn.map(player).join(", "), id: "in", header: "In", enableSorting: false, cell: ({ row }) => <span className="whitespace-normal">{chip(row.original.chip) ?? playerLinks(row.original.transfersIn)}</span> },
    { accessorFn: (row) => chip(row.chip) ?? row.transfersOut.map(player).join(", "), id: "out", header: "Out", enableSorting: false, cell: ({ row }) => <span className="whitespace-normal">{chip(row.original.chip) ?? playerLinks(row.original.transfersOut)}</span> },
    { accessorKey: "cost", header: "−", enableSorting: false, cell: ({ getValue }) => Number(getValue()) || "" },
  ];
  return <PageMotion><div className="league-page"><section className="overview-section transfers-section"><div className="overview-section__heading"><h2>Transfers</h2></div><DataTable data={league.data.transfers} columns={columns} /></section></div></PageMotion>;
}
