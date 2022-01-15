import {
  Button,
  CardHeader,
  Grid,
  Link,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React from "react";
import { useStateValue } from "../state";
import {
  getElementPoints,
  getElementsTeam,
  getPlayerName,
  getPlayerPosition,
  stillToPlay,
} from "../tools";
import { Manager } from "../types/newleague";
import CardWithTable from "./CardWithTable";
import ChipsUsed from "./ChipsUsed";
import CompareManager from "./CompareManager";

export interface ManagerPageType {
  manager: Manager;
  points: number;
}

interface ManagerPageProps {
  manager: ManagerPageType;
  setManagerPage: React.Dispatch<React.SetStateAction<ManagerPageType | null>>;
}

const ManagerPage: React.FC<ManagerPageProps> = ({
  manager,
  setManagerPage,
}) => {
  const [{ bssData, liveData, selectedGw }] = useStateValue();
  if (!bssData?.elements || !liveData?.elements) return null;
  return (
    <>
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
                title={manager.manager.player_name}
                style={{ textAlign: "center" }}
              />
            </Grid>
            <Grid
              item
              xs={3}
              display="flex"
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Link
                href={`https://fantasy.premierleague.com/entry/${manager.manager.entry}/event/${selectedGw}/`}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="contained">FPL</Button>
              </Link>
            </Grid>
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
          {manager.manager.gw_team.picks
            .filter((pick) => pick.multiplier > 0)
            .map((pick) => {
              return (
                <TableRow key={pick.element}>
                  <TableCell>
                    {getPlayerName(bssData.elements[pick.element])}
                    {pick.is_captain ? " (C)" : ""}
                    {pick.is_vice_captain ? " (V)" : ""}
                    {stillToPlay(pick.element, liveData) ? " 🟢" : " 🏁"}
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
                    {getElementPoints(liveData.elements[pick.element]) *
                      pick.multiplier}
                  </TableCell>
                </TableRow>
              );
            })}
          {manager.manager.gw_team.entry_history.event_transfers_cost ==
          0 ? null : (
            <TableRow>
              <TableCell>Transfers cost</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                {manager.manager.gw_team.entry_history.event_transfers_cost *
                  -1}
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>{manager.points}</TableCell>
          </TableRow>
        </TableBody>
      </CardWithTable>
      <CardWithTable
        header={
          <CardHeader
            title={"Bench"}
            style={{ textAlign: "center" }}
          ></CardHeader>
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
          {manager.manager.gw_team.picks
            .filter((pick) => pick.multiplier == 0)
            .map((pick) => {
              return (
                <TableRow key={pick.element}>
                  <TableCell>
                    {getPlayerName(bssData.elements[pick.element])}
                    {stillToPlay(pick.element, liveData) ? " 🟢" : " 🏁"}
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
                    {liveData.elements[pick.element]?.stats.total_points}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </CardWithTable>
      <ChipsUsed manager={manager.manager} />
      <CompareManager manager={manager.manager} />
    </>
  );
};
export default ManagerPage;
