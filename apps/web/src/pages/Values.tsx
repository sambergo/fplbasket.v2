import type { DataTableColumnDef } from "@/components/DataTable";
import type { Manager } from "@fpl-basket/contracts";
import { useParams } from "react-router-dom";
import { DataTable } from "@/components/DataTable";
import { ErrorPanel, LoadingPage, PageMotion } from "@/components/common";
import { useLeagueQuery } from "@/hooks";

export function Values() {
  const { leagueId = "" } = useParams();
  const league = useLeagueQuery(leagueId);
  if (league.isPending) return <LoadingPage />;
  if (league.error) return <ErrorPanel error={league.error} retry={() => league.refetch()} />;
  const rows = [...league.data.managers].sort((a, b) => b.teamValue - a.teamValue);
  const averageValue = rows.length
    ? rows.reduce((sum, manager) => sum + manager.teamValue, 0) / rows.length / 10
    : 0;
  const columns: DataTableColumnDef<Manager>[] = [
    { accessorKey: "playerName", header: "Manager", enableSorting: false },
    { accessorKey: "teamValue", header: "Value", enableSorting: false, cell: ({ getValue }) => (Number(getValue()) / 10).toFixed(1) },
  ];
  return <PageMotion><div className="league-page"><section className="overview-section values-section"><div className="overview-section__heading"><h2>Team values</h2><span className="values-average">Average: {averageValue.toFixed(1)}</span></div><DataTable data={rows} columns={columns} /></section></div></PageMotion>;
}
