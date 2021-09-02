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
  console.log("captains", league.teams.captains);
  if (!bssData || !league) return null;
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
            {league.teams.captains.map((c) => {
              return (
                <TableRow key={c.captain}>
                  <TableCell>
                    {`${bssData.elements[c.captain].first_name} ${
                      bssData.elements[c.captain].web_name
                    }`}
                  </TableCell>
                  <TableCell>{c.captainedBy.join(", ")}</TableCell>
                  <TableCell>{c.captainedBy.length} </TableCell>
                </TableRow>
              );
            })}
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
export default Captains;
