import {
  Box,
  CardHeader,
  Grid,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import RefreshIcon from "@material-ui/icons/Refresh";
import { FC, useEffect, useState } from "react";
import { getLiveElements } from "../service";
import { useStateValue } from "../state";
import { LiveFetchType } from "../types/fetchTypes";
import { LiveElement } from "../types/liveElements";
import { Manager, ParsedManagerPick } from "../types/newleague";
import CardWithTable from "./CardWithTable";
import ManagerPage, { ManagerPageType } from "./ManagerPage";
import TeamBox from "./TeamBox";

interface StandingsRowType {
  manager: Manager;
  gwPoints: number;
  totalPoints: number;
  i?: number;
  old_rank: number;
  setManagerPage: React.Dispatch<React.SetStateAction<ManagerPageType | null>>;
}
const StandingsRow: FC<StandingsRowType> = ({
  gwPoints,
  totalPoints,
  manager,
  setManagerPage,
  old_rank,
  i = 1,
}) => {
  const getRank = () => {
    const arrow = old_rank > i ? 0 : old_rank < i ? 2 : 1;
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
      <TableCell>
        <TeamBox manager={manager} />
      </TableCell>
      <TableCell>{gwPoints}</TableCell>
      <TableCell>{totalPoints}</TableCell>
    </TableRow>
  );
};

interface StandingsRowsType {
  managers: ParsedManagerPick[];
  setManagerPage: React.Dispatch<React.SetStateAction<ManagerPageType | null>>;
}

interface OldRankType {
  id: number;
  prev_points: number;
}

const StandingsRows: FC<StandingsRowsType> = ({ managers, setManagerPage }) => {
  const [{ liveElements }] = useStateValue();
  const [standings, setStandings] = useState<StandingsRowType[]>([]);
  const oldRanks: OldRankType[] = managers
    .map((mgrObj) => {
      const oldRankObj = {
        id: mgrObj.manager.id,
        prev_points: mgrObj.manager.prev_points,
      };
      return oldRankObj;
    })
    .sort((a, b) => b.prev_points - a.prev_points);
  if (!liveElements) return null;
  useEffect(() => {
    const standingsTemp: StandingsRowType[] = [];
    for (const managerObject of managers) {
      const { gw_team } = managerObject.manager;
      const oldTotal: number = managerObject.manager.prev_points;
      let gwTotal: number = gw_team.entry_history.event_transfers_cost * -1;
      for (const pick of managerObject.parsedPicks.active) {
        const i = pick.element;
        const livePoints = liveElements[i].stats.total_points;
        gwTotal += livePoints * pick.multiplier;
      }
      standingsTemp.push({
        manager: managerObject.manager,
        gwPoints: gwTotal,
        totalPoints: oldTotal + gwTotal,
        setManagerPage: setManagerPage,
        old_rank:
          1 + oldRanks.findIndex((or) => or.id === managerObject.manager.id),
      });
    }
    standingsTemp.sort((a, b) => b.totalPoints - a.totalPoints);
    setStandings(standingsTemp);
  }, [liveElements]);
  return (
    <>
      {standings.map((s, i) => (
        <StandingsRow key={i} {...s} i={i + 1} />
      ))}
    </>
  );
};

const Standings: FC = () => {
  const [{ leagueData, selectedGw }, dispatch] = useStateValue();
  if (!leagueData?.parsedData) return null;
  const [managerPage, setManagerPage] = useState<ManagerPageType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleRefresh = async () => {
    setLoading(true);
    const params: LiveFetchType = { gw: selectedGw };
    const liveElementsRequest = await getLiveElements(params);
    if (liveElementsRequest.status == 200 && liveElementsRequest.data) {
      const data: LiveElement[] = liveElementsRequest.data;
      dispatch({ type: "SET_LIVE_ELEMENTS", payload: data });
    } else alert("Refresh failed");
    setLoading(false);
  };
  if (managerPage)
    return (
      <ManagerPage setManagerPage={setManagerPage} manager={managerPage} />
    );
  return (
    <>
      <CardWithTable
        header={
          <Grid container alignContent="space-between">
            <Grid item xs={2}>
              {" "}
            </Grid>
            <Grid item xs={8}>
              <CardHeader title={"Standings"} style={{ textAlign: "center" }} />
            </Grid>
            <Grid container item xs={2} alignContent="center">
              <IconButton
                disabled={loading}
                onClick={() => handleRefresh()}
                style={{ margin: "auto", cursor: "pointer" }}
              >
                <RefreshIcon fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>
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
