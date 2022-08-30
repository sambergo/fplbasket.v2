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
import { fromTeamToPlay, getArrow, getElementPoints } from "../tools";
import { LiveFetchType } from "../types/fetchTypes";
import { LiveData } from "../types/livedata";
import { Manager, ParsedManagerPick } from "../types/newleague";
import CardWithTable from "./CardWithTable";
import ManagerPage, { ManagerPageType } from "./ManagerPage";
import PointsBox from "./PointsBox";
import ShowLiveBonusToggleButton from "./ShowLiveBonusToggleButton";
import TeamBox from "./TeamBox";

interface StandingsRowType {
  manager: Manager;
  gwPoints: number;
  totalPoints: number;
  i?: number;
  old_rank: number;
  setManagerPage: React.Dispatch<React.SetStateAction<ManagerPageType | null>>;
  managersLength?: number;
}
const StandingsRow: FC<StandingsRowType> = ({
  gwPoints,
  totalPoints,
  manager,
  setManagerPage,
  old_rank,
  managersLength,
  i = 1,
}) => {
  const [{ liveData }] = useStateValue();
  if (!liveData) return null;
  const getRank = () => {
    const arrow = getArrow(old_rank, i, managersLength ?? 0);
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
        <KeyboardArrowDownIcon color="error" style={iconStyles} />
      );
    else if (arrow == 1)
      return getRankCell(
        i,
        <FiberManualRecordIcon color="disabled" style={iconStyles} />
      );
    else if (arrow == 3) return getRankCell(i, "🚀");
    else
      return getRankCell(
        i,
        <KeyboardArrowUpIcon color="primary" style={iconStyles} />
      );
  };
  return (
    <TableRow
      style={{ cursor: "pointer" }}
      onClick={() => {
        setManagerPage(manager ? { manager: manager, points: gwPoints } : null);
        window.scroll({ top: 0 });
      }}
      key={i}
    >
      <TableCell>{getRank()}</TableCell>
      <TableCell>
        <TeamBox manager={manager} />
      </TableCell>
      <TableCell>
        {fromTeamToPlay(
          liveData,
          manager.gw_team.picks.filter((pick) => pick.multiplier > 0)
        )}
      </TableCell>
      <TableCell>
        <PointsBox gwPoints={gwPoints} totalPoints={totalPoints} />
      </TableCell>
      {/* <TableCell>{gwPoints}</TableCell> */}
      {/* <TableCell>{totalPoints}</TableCell> */}
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
  const [{ liveData, showLiveBonus }] = useStateValue();
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
  if (!liveData?.elements) return null;
  useEffect(() => {
    const standingsTemp: StandingsRowType[] = [];
    for (const managerObject of managers) {
      const { gw_team } = managerObject.manager;
      const oldTotal: number = managerObject.manager.prev_points;
      let gwTotal: number = gw_team.entry_history.event_transfers_cost * -1;
      for (const pick of managerObject.parsedPicks.active) {
        const livePoints = getElementPoints(
          liveData.elements[pick.element],
          showLiveBonus
        );
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
  }, [liveData, showLiveBonus]);
  return (
    <>
      {standings.map((s, i) => (
        <StandingsRow
          key={i}
          {...s}
          i={i + 1}
          managersLength={managers.length}
        />
      ))}
      <TableRow>
        <TableCell>Average</TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell>
          {(
            standings.reduce((prev, curr) => prev + curr.gwPoints, 0) /
            standings.length
          ).toFixed(2)}
        </TableCell>
      </TableRow>
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
      const data: LiveData = liveElementsRequest.data;
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
              <ShowLiveBonusToggleButton />
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
            <TableCell>
              <Box>🏇</Box>
            </TableCell>
            <TableCell>
              <Box>
                <Box>GW </Box>
                <Box>Tot </Box>
              </Box>
            </TableCell>
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
