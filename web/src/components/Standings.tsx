import { TableCell, TableHead, TableRow } from "@material-ui/core";
import { FC } from "react";
import { DataType } from "../types/data";
import { LeagueType } from "../types/league";
import { DefaultProps } from "../types/props";
import CardWithTable from "./CardWithTable";

interface StandingsProps {}

interface StandingsRowType {
  player_name: string;
  gwPoints: number;
  totalPoints: number;
  i?: number;
}
const StandingsRow: FC<StandingsRowType> = ({
  gwPoints,
  totalPoints,
  player_name,
  i = 1,
}) => (
  <TableRow key={i}>
    <TableCell>{i + 1}</TableCell>
    <TableCell>{player_name}</TableCell>
    <TableCell>{gwPoints}</TableCell>
    <TableCell>{totalPoints}</TableCell>
  </TableRow>
);
interface StandingsRowsType {
  managerList: LeagueType["teams"]["managerList"];
  bssData: DataType;
}
const StandingsRows: FC<StandingsRowsType> = ({ managerList, bssData }) => {
  let standings: StandingsRowType[] = [];
  for (const manager of managerList) {
    const oldTotal: number = manager.prev_team.entry_history.total_points;
    //   const gwPicks = []
    let gwTotal: number = 0 - manager.team.entry_history.event_transfers_cost;
    for (const pick of manager.team.picks) {
      const element = bssData.elements[pick.element];
      gwTotal += element.event_points * pick.multiplier;
    }
    standings.push({
      player_name: manager.player_name,
      gwPoints: gwTotal,
      totalPoints: oldTotal + gwTotal,
    });
  }
  console.log("standings : ", standings);
  standings.sort((a, b) => b.totalPoints - a.totalPoints);
  return (
    <>
      {standings.map((s, i) => (
        <StandingsRow key={i} {...s} i={i} />
      ))}
    </>
  );
};

const Standings: FC<Pick<DefaultProps, "league" | "bssData">> = ({
  league,
  bssData,
}) => {
  if (!league || !bssData) return null;

  //   const getStandings = () => {
  //     let standings: {
  //       player_name: string;
  //       gwPoints: number;
  //       totalPoints: number;
  //     }[] = [];
  //     for (const manager of league.teams.managerList) {
  //       const oldTotal: number = manager.prev_team.entry_history.total_points;
  //       //   const gwPicks = []
  //       let gwTotal: number = 0 - manager.team.entry_history.event_transfers_cost;
  //       for (const pick of manager.team.picks) {
  //         const element = bssData.elements[pick.element];
  //         gwTotal += element.event_points * pick.multiplier;
  //       }
  //       standings.push({
  //         player_name: manager.player_name,
  //         gwPoints: gwTotal,
  //         totalPoints: oldTotal + gwTotal,
  //       });
  //     }
  //     console.log("standings : ", standings);
  //     return standings.sort((a, b) => b.totalPoints - a.totalPoints);
  //   };

  return (
    <CardWithTable>
      <TableHead>
        <TableRow>
          <TableCell>Rank</TableCell>
          <TableCell>Manager</TableCell>
          <TableCell>GW</TableCell>
          <TableCell>Tot</TableCell>
        </TableRow>
      </TableHead>
      <StandingsRows bssData={bssData} managerList={league.teams.managerList} />
    </CardWithTable>
  );
};
export default Standings;
