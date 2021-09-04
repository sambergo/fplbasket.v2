import {
  Button,
  InputBase,
  Paper,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { getPlayerName } from "../tools";
import { DataType } from "../types/data";
import { LeagueType, Player } from "../types/league";
import CardWithTable from "./CardWithTable";

interface PlayersProps {
  bssData: DataType | undefined;
  leagueId: string;
  selectedGW: number;
  setselectedGW: any;
  gws: DataType["events"];
  league: LeagueType;
}

const Players: React.FC<PlayersProps> = ({ bssData, league }) => {
  if (!bssData || !league) return null;
  const [filter, setFilter] = useState<string>("");
  const filterPlayers = (filter: string, players: Player[]) => {
    if (filter == "") return players;
    return players.filter((plr) =>
      getPlayerName(bssData.elements[plr.player]).toLowerCase().includes(filter)
    );
  };
  return (
    <CardWithTable
      header={
        <>
          <TextField
            fullWidth
            value={filter || ""}
            InputProps={{
              endAdornment: (
                <Button variant="text" onClick={() => setFilter("")}>
                  Clear
                </Button>
              ),
            }}
            label={`Search from ${league.teams.players.length} players...`}
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
          />
        </>
      }
    >
      <TableHead>
        <TableRow>
          <TableCell>Player</TableCell>
          <TableCell>Owners</TableCell>
          <TableCell>#</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filterPlayers(filter, league.teams.players).map((plr) => (
          <TableRow key={plr.player}>
            <TableCell>{`${bssData.elements[plr.player].first_name} ${
              bssData.elements[plr.player].web_name
            }`}</TableCell>
            <TableCell>{plr.ownedBy.join(", ")}</TableCell>
            <TableCell>{plr.ownedBy.length}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </CardWithTable>
  );
};
export default Players;
