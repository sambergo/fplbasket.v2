import type { ColumnDef } from "@tanstack/react-table";
import type { League } from "@fpl-basket/contracts";
import { useParams } from "react-router-dom";
import { DataTable } from "@/components/DataTable";
import { ErrorPanel, LoadingPage, PageMotion } from "@/components/common";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useContextQuery, useLeagueQuery } from "@/hooks";

type Group = League["ownership"][number];

function shirtUrl(teamCode: number, isGoalkeeper: boolean) {
  const goalkeeperVariant = isGoalkeeper ? "_1" : "";
  return `https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${teamCode}${goalkeeperVariant}-66.webp`;
}

function playerPhotoUrl(photo: string) {
  const photoId = photo.replace(/\.[^.]+$/, "");
  return `https://resources.premierleague.com/premierleague/photos/players/250x250/p${photoId}.png`;
}

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`overview-section ${className}`}>
      <div className="overview-section__heading"><h2>{title}</h2><span /></div>
      {children}
    </section>
  );
}

export function Overview() {
  const { leagueId = "" } = useParams();
  const league = useLeagueQuery(leagueId);
  const context = useContextQuery();
  if (league.isPending || context.isPending) return <LoadingPage />;
  if (league.error || context.error) return <ErrorPanel error={(league.error ?? context.error)!} retry={() => { league.refetch(); context.refetch(); }} />;

  const player = (id: number) => context.data.players.find((item) => item.id === id);
  const playerName = (id: number) => player(id)?.web_name ?? `Player ${id}`;
  const manager = (id: number) => league.data.managers.find((item) => item.entry === id)?.playerName ?? String(id);
  const columns = (image: "shirt" | "face"): ColumnDef<Group>[] => [
    {
      accessorFn: (row) => playerName(row.playerId),
      id: "player",
      header: "Player",
      enableSorting: false,
      cell: ({ row }) => {
        const item = player(row.original.playerId);
        return (
          <span className="overview-player">
            {image === "face" && item?.photo ? (
              <img
                className="overview-player__face"
                src={playerPhotoUrl(item.photo)}
                alt=""
                loading="lazy"
                onError={(event) => {
                  if (item.team_code === undefined) return;
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = shirtUrl(
                    item.team_code,
                    item.element_type === 1,
                  );
                  event.currentTarget.className =
                    "overview-player__face overview-player__face--shirt";
                }}
              />
            ) : image === "face" && item?.team_code !== undefined ? (
              <img
                className="overview-player__face overview-player__face--shirt"
                src={shirtUrl(item.team_code, item.element_type === 1)}
                alt=""
                loading="lazy"
              />
            ) : item?.team_code !== undefined ? (
              <img
                className="overview-player__shirt"
                src={shirtUrl(item.team_code, item.element_type === 1)}
                alt=""
                loading="lazy"
              />
            ) : null}
            {playerName(row.original.playerId)}
          </span>
        );
      },
    },
    {
      accessorFn: (row) => row.managerIds.map(manager).join(", "),
      id: "managers",
      header: "Owners",
      enableSorting: false,
      cell: ({ row }) => <span className="overview-owners">{row.original.managerIds.map(manager).join(", ")}</span>,
    },
    { accessorFn: (row) => row.managerIds.length, id: "count", header: "#", enableSorting: false },
  ];

  return (
    <PageMotion>
      <div className="overview-backdrop" aria-hidden="true" />
      <div className={`overview-page ${league.data.chips.length ? "" : "overview-page--no-chips"}`}>
        {league.data.chips.length > 0 && (
          <Section title="Chips played" className="overview-section--chips">
            <Table>
              <TableHeader><TableRow><TableHead>Chip</TableHead><TableHead>Used by</TableHead></TableRow></TableHeader>
              <TableBody>{league.data.chips.map((chip) => (
                <TableRow key={chip.chip}>
                  <TableCell className="font-semibold capitalize">{chip.chip.replace("3xc", "Triple captain").replace("bboost", "Bench boost").replace("freehit", "Free hit")}</TableCell>
                  <TableCell className="whitespace-normal text-[#a6adc8]">{chip.managerIds.map(manager).join(", ")}</TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          </Section>
        )}
        <Section title="Captains" className="overview-section--captains"><DataTable data={league.data.captains} columns={columns("face")} /></Section>
        <Section title="Players" className="overview-section--players"><DataTable data={league.data.ownership} columns={columns("face")} filterPlaceholder="Search players" /></Section>
      </div>
    </PageMotion>
  );
}
