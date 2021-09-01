import {
  Card,
  CardContent,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { TextRotationAngleupTwoTone } from "@material-ui/icons";
import React from "react";
import { DataType } from "../types/data";
import { LeagueType } from "../types/league";

interface PlayersProps {
  bssData: DataType | undefined;
  leagueId: string;
  selectedGW: number;
  setselectedGW: any;
  gws: DataType["events"];
  league: LeagueType;
}

const Players: React.FC<PlayersProps> = ({
  bssData,
  league,
  leagueId,
  selectedGW,
  setselectedGW,
  gws,
}) => {
  console.log("players");
  if (!bssData || !league) return null;

  const getActiveTeam = (team: LeagueType["teams"][0]["team"]) => {
    let newteam = team.picks.slice(0, 11).map((p) => p.element);
    for (const sub of team.automatic_subs) {
      const index = newteam.indexOf(sub.element_out);
      newteam[index] = sub.element_in;
    }
    console.log("team : ", team);
    console.log("newteam : ", newteam);
    return newteam;
  };
  const parsePlayers = () => {
    const players = Array.from(
      new Set(
        league.teams
          .map((team) => getActiveTeam(team.team))
          .reduce((arr, item) => {
            return [...arr, ...item];
          }, [])
      )
    );

    const playersAndManagers = players.map((plr) => {
      const ownedBy = league.teams
        .filter((team) => team.team.picks.find((p) => p.element == plr))
        .map((team) => team.player_name);
      return {
        player: `${bssData.elements[plr].first_name} ${bssData.elements[plr].web_name}`,
        ownedBy,
      };
    });
    console.log("players : ", players);
    console.log("playersAndManagers : ", playersAndManagers);
    return playersAndManagers;
  };
  //   parsePlayers();
  return (
    <Card variant="elevation" style={{ borderRadius: "5px" }}>
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Player</TableCell>
                <TableCell>Owners</TableCell>
                <TableCell>#</TableCell>
              </TableRow>
            </TableHead>
            {parsePlayers().map((playerObject) => (
              <TableRow key={playerObject.player}>
                <TableCell>{playerObject.player}</TableCell>
                <TableCell>{playerObject.ownedBy.join(", ")}</TableCell>
                <TableCell>{playerObject.ownedBy.length}</TableCell>
              </TableRow>
            ))}
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
export default Players;
