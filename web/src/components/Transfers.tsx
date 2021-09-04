import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import React from "react";
import { getPlayerName } from "../tools";
import { DefaultProps } from "../types/props";
import CardWithTable from "./CardWithTable";

// interface TransfersProps {}

const Transfers: React.FC<Pick<DefaultProps, "bssData" | "league">> = ({
  bssData,
  league,
}) => {
  // const getTransfers = () => {
  //     const transfers:any = []
  //     for (const manager of league.teams.managerList) {
  //         const picks = manager.team.picks
  //         const prev_picks = league.prev_gw_teams.managerList.find(m => m.player_name == manager.player_name)!.team.picks
  //     }
  // }
  if (!bssData) return null;
  return (
    <CardWithTable>
      <TableHead>
        <TableRow>
          <TableCell>Manager</TableCell>
          <TableCell>Transfers in</TableCell>
          <TableCell>Transfers out</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {league.teams.transferList.map((manager) => (
          <TableRow key={manager.managerName}>
            <TableCell>{manager.managerName}</TableCell>
            <TableCell>
              {manager.chip ??
                manager.transfersIn
                  .map((t) => getPlayerName(bssData.elements[t]))
                  .join(", ")}
            </TableCell>
            <TableCell>
              {manager.chip ??
                manager.transfersOut
                  .map((t) => getPlayerName(bssData.elements[t]))
                  .join(", ")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </CardWithTable>
  );
};
export default Transfers;
