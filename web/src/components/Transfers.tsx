import {
  CardHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React from "react";
import { useStateValue } from "../state";
import { getPlayerName, getPlayerWebName } from "../tools";
import CardWithTable from "./CardWithTable";

// interface TransfersProps {}

const Transfers: React.FC = () => {
  const [{ bssData, leagueData }] = useStateValue();
  if (!bssData || !leagueData?.parsedData?.transfers) return null;
  return (
    <CardWithTable
      header={
        <CardHeader title={"Transfers"} style={{ textAlign: "center" }} />
      }
    >
      <TableHead>
        <TableRow>
          <TableCell>Manager</TableCell>
          <TableCell>In</TableCell>
          <TableCell>Out</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {leagueData.parsedData.transfers.map((manager) => (
          <TableRow key={manager.managerName}>
            <TableCell>{manager.managerName}</TableCell>
            <TableCell>
              {manager.chip ??
                manager.transfersIn
                  .map((t) => getPlayerWebName(bssData.elements[t]))
                  .join(", ")}
            </TableCell>
            <TableCell>
              {manager.chip ??
                manager.transfersOut
                  .map((t) => getPlayerWebName(bssData.elements[t]))
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
