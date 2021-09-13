import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import React from "react";
import { useStateValue } from "../state";
import { getPlayerName } from "../tools";
import CardWithTable from "./CardWithTable";

// interface TransfersProps {}

const Transfers: React.FC = () => {
  const [{ bssData, leagueData }] = useStateValue();
  if (!bssData || !leagueData?.parsedData?.transfers) return null;
  return (
    <CardWithTable>
      <TableHead>
        <TableRow>
          <TableCell>Manager</TableCell>
          <TableCell>Transfers in</TableCell>
          <TableCell>Transfers out</TableCell>
          <TableCell>Cost? </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {leagueData.parsedData.transfers.map((manager) => (
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
            <TableCell>
              {manager.transfersCost !== 0 ? manager.transfersCost * -1 : ""}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </CardWithTable>
  );
};
export default Transfers;
