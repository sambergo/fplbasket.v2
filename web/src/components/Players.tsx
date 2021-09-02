import {
  Card,
  CardContent,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
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
  if (!bssData || !league) return null;
  console.log("league : ", league.teams);
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
            {league.teams.players.map((plr) => (
              <TableRow key={plr.player}>
                <TableCell>{`${bssData.elements[plr.player].first_name} ${
                  bssData.elements[plr.player].web_name
                }`}</TableCell>
                <TableCell>{plr.ownedBy.join(", ")}</TableCell>
                <TableCell>{plr.ownedBy.length}</TableCell>
              </TableRow>
            ))}
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
export default Players;
