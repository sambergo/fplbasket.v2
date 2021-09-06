import {
  Button,
  CardHeader,
  Grid,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React from "react";
import { getElementsTeam, getPlayerName, getPlayerPosition } from "../tools";
import { DataType } from "../types/data";
import { LeagueType, Manager } from "../types/league";
import { DefaultProps } from "../types/props";
import CardWithTable from "./CardWithTable";

interface ManagerPageProps {
  bssData: DataType;
  league: LeagueType;
  manager: Manager;
  setManagerPage: React.Dispatch<React.SetStateAction<Manager | null>>;
}

const ManagerPage: React.FC<ManagerPageProps> = ({
  bssData,
  manager,
  setManagerPage,
  league,
}) => {
  //   const getPickRows = (picks: Pick[]) => {
  //     sortedAndfilteredPicks = picks.map(pick => )
  //
  //   }
  return (
    <CardWithTable
      header={
        <Grid container>
          <Grid
            item
            xs={3}
            display="flex"
            justifyContent="left"
            alignItems="center"
          >
            <Button onClick={() => setManagerPage(null)} variant="contained">
              Back
            </Button>
          </Grid>
          <Grid item xs={6}>
            <CardHeader
              title={manager.player_name}
              style={{ textAlign: "center" }}
            />
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      }
    >
      <TableHead>
        <TableRow>
          <TableCell>Player</TableCell>
          <TableCell>Team</TableCell>
          <TableCell>Position</TableCell>
          <TableCell>Points</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {manager.team.picks
          .filter((pick) => pick.multiplier > 0)
          .map((pick) => {
            return (
              <TableRow key={pick.element}>
                <TableCell>
                  {getPlayerName(bssData.elements[pick.element])}
                  {pick.is_captain ? " (C)" : ""}
                </TableCell>
                <TableCell>
                  {getElementsTeam(
                    bssData.elements[pick.element],
                    bssData.teams
                  )}
                </TableCell>
                <TableCell>
                  {getPlayerPosition(bssData.elements[pick.element])}
                </TableCell>
                <TableCell>
                  {bssData.elements[pick.element].event_points *
                    pick.multiplier}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </CardWithTable>
  );
};
export default ManagerPage;
