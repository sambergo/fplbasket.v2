import {
  Box,
  CardHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import { FC } from "react";
import { DataType } from "../types/data";
import { LeagueType, Manager } from "../types/league";
import { DefaultProps } from "../types/props";
import CardWithTable from "./CardWithTable";
import ManagerPage from "./ManagerPage";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
interface StandingsRowType {
  manager: Manager;
  gwPoints: number;
  totalPoints: number;
  i?: number;
  setManagerPage: React.Dispatch<React.SetStateAction<Manager | null>>;
}
const StandingsRow: FC<StandingsRowType> = ({
  gwPoints,
  totalPoints,
  manager,
  setManagerPage,
  i = 1,
}) => {
  const getRank = () => {
    const arrow = manager.last_rank < i ? 0 : manager.last_rank > i ? 2 : 1;
    const typoStyles: React.CSSProperties = {
      marginRight: 5,
      marginBlock: "auto",
    };
    const iconStyles: React.CSSProperties = {
      marginBlock: "auto",
    };
    const getRankCell = (rank: number, icon: any) => (
      <Box display="flex">
        <Typography style={typoStyles} variant="button">
          {rank}
        </Typography>
        {icon}
      </Box>
    );
    if (arrow == 0)
      return getRankCell(
        i,
        <KeyboardArrowUpIcon color="primary" style={iconStyles} />
      );
    else if (arrow == 1)
      return getRankCell(
        i,
        <FiberManualRecordIcon color="disabled" style={iconStyles} />
      );
    else
      return getRankCell(
        i,
        <KeyboardArrowDownIcon color="error" style={iconStyles} />
      );
  };
  return (
    <TableRow
      style={{ cursor: "pointer" }}
      onClick={() => setManagerPage(manager ?? null)}
      key={i}
    >
      <TableCell>{getRank()}</TableCell>
      <TableCell>{manager.player_name}</TableCell>
      <TableCell>{gwPoints}</TableCell>
      <TableCell>{totalPoints}</TableCell>
    </TableRow>
  );
};
interface StandingsRowsType {
  managerList: LeagueType["teams"]["managerList"];
  bssData: DataType;
  setManagerPage: React.Dispatch<React.SetStateAction<Manager | null>>;
}

const StandingsRows: FC<StandingsRowsType> = ({
  managerList,
  bssData,
  setManagerPage,
}) => {
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
      manager: manager,
      gwPoints: gwTotal,
      totalPoints: oldTotal + gwTotal,
      setManagerPage: setManagerPage,
    });
  }
  standings.sort((a, b) => b.totalPoints - a.totalPoints);
  return (
    <>
      {standings.map((s, i) => (
        <StandingsRow key={i} {...s} i={i + 1} />
      ))}
    </>
  );
};

const Standings: FC<Pick<DefaultProps, "league" | "bssData">> = ({
  league,
  bssData,
}) => {
  if (!league || !bssData) return null;
  const [managerPage, setManagerPage] = useState<Manager | null>(null);
  if (managerPage)
    return (
      <ManagerPage
        setManagerPage={setManagerPage}
        bssData={bssData}
        league={league}
        manager={managerPage}
      />
    );
  return (
    <>
      <CardWithTable
        header={
          <CardHeader title={"Standings"} style={{ textAlign: "center" }} />
        }
      >
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Manager</TableCell>
            <TableCell>GW</TableCell>
            <TableCell>Tot</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <StandingsRows
            setManagerPage={setManagerPage}
            bssData={bssData}
            managerList={league.teams.managerList}
          />
        </TableBody>
      </CardWithTable>
    </>
  );
};

export default Standings;
