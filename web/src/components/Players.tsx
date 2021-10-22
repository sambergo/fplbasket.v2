import {
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import { useStateValue } from "../state";
import { getPlayerName, getPlayerWebName } from "../tools";
import { Player } from "../types/newleague";
import CardWithTable from "./CardWithTable";

const Players: React.FC = () => {
  const [{ bssData, leagueData }] = useStateValue();
  if (!bssData || !leagueData) return null;
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
            label={`Search from ${leagueData.parsedData.players.length} players...`}
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
        {filterPlayers(filter, leagueData.parsedData.players).map((plr) => (
          <TableRow key={plr.player}>
            <TableCell>
              {getPlayerWebName(bssData.elements[plr.player])}
            </TableCell>
            <TableCell>{plr.ownedBy.join(", ")}</TableCell>
            <TableCell>{plr.ownedBy.length}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </CardWithTable>
  );
};
export default Players;
