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
import CardWithTable from "./CardWithTable";
import ManagerPage, { ManagerPageType } from "./ManagerPage";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { useStateValue } from "../state";
import { Manager, ParsedManagerPick } from "../types/newleague";

interface StandingsRowType {
  manager: Manager;
  gwPoints: number;
  totalPoints: number;
  i?: number;
  setManagerPage: React.Dispatch<React.SetStateAction<ManagerPageType | null>>;
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
      onClick={() =>
        setManagerPage(manager ? { manager: manager, points: gwPoints } : null)
      }
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
  managers: ParsedManagerPick[];
  setManagerPage: React.Dispatch<React.SetStateAction<ManagerPageType | null>>;
}

const StandingsRows: FC<StandingsRowsType> = ({ managers, setManagerPage }) => {
  const [{ bssData }] = useStateValue();
  if (!bssData) return null;
  let standings: StandingsRowType[] = [];
  for (const managerObject of managers) {
    const { gw_team } = managerObject.manager;
    const oldTotal: number =
      gw_team.entry_history.total_points - gw_team.entry_history.points;
    //   const gwPicks = []
    let gwTotal: number = 0;
    for (const pick of managerObject.parsedPicks.active) {
      const element = bssData.elements[pick.element];
      gwTotal += element.event_points * pick.multiplier;
    }
    standings.push({
      manager: managerObject.manager,
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

const Standings: FC = () => {
  const [{ bssData, leagueData }] = useStateValue();
  if (!leagueData?.parsedData || !bssData) return null;
  const [managerPage, setManagerPage] = useState<ManagerPageType | null>(null);
  if (managerPage)
    return (
      <ManagerPage setManagerPage={setManagerPage} manager={managerPage} />
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
            managers={leagueData.parsedData.managers}
          />
        </TableBody>
      </CardWithTable>
    </>
  );
};

export default Standings;
