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
import React from "react";
import { DataType } from "../types/data";
import { LeagueType } from "../types/league";

interface CaptainsProps {
  bssData: DataType | undefined;
  leagueId: string;
  selectedGW: number;
  setselectedGW: any;
  gws: DataType["events"];
  league: LeagueType;
}

const Captains: React.FC<CaptainsProps> = ({
  bssData,
  league,
  leagueId,
  selectedGW,
  setselectedGW,
  gws,
}) => {
  console.log("captains");
  if (!bssData || !league) return null;
  const parseCaptains = () => {
    const captains = Array.from(
      new Set(
        league.teams
          .map((team) => team.team.picks.find((pick) => pick.is_captain))
          .map((obj) => obj?.element)
      )
    ).map((c) => (c == undefined ? 1 : c));
    const captainsAndManagers = captains.map((n) => {
      const managers = league.teams
        .filter((team) =>
          team.team.picks.find((p) => p.is_captain && p.element == n)
        )
        .map((m) => m.player_name);
      return {
        player: `${bssData.elements[n].first_name} ${bssData.elements[n].web_name}`,
        captainedBy: managers,
      };
    });
    return captainsAndManagers;
  };
  return (
    <Card variant="elevation" style={{ borderRadius: "5px" }}>
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Captain</TableCell>
                <TableCell>Owners</TableCell>
                <TableCell>#</TableCell>
              </TableRow>
            </TableHead>
            {parseCaptains().map((playerObject) => (
              <TableRow key={playerObject.player}>
                <TableCell>{playerObject.player}</TableCell>
                <TableCell>{playerObject.captainedBy.join(", ")}</TableCell>
                <TableCell>{playerObject.captainedBy.length}</TableCell>
              </TableRow>
            ))}
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
export default Captains;
