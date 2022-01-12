import {
  CardHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React from "react";
import { useStateValue } from "../state";
import { getPlayerWebName } from "../tools";
import CardWithTable from "./CardWithTable";

// interface TransfersProps {}

const Transfers: React.FC = () => {
  const [{ bssData, leagueData, selectedGw }] = useStateValue();
  if (!bssData) return null;
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
        {leagueData?.league_curr.managers
          .filter(
            (manager) =>
              manager.transfers.filter(
                (transfer) => transfer.event === parseInt(selectedGw)
              ).length > 0
          )
          .map((manager) => (
            <TableRow key={manager.id}>
              <TableCell>{manager.player_name}</TableCell>
              <TableCell>
                {manager.gw_team.active_chip === "freehit"
                  ? "*Freehit*"
                  : manager.gw_team.active_chip === "wildcard"
                  ? "*Wildcard*"
                  : manager.transfers
                      .filter(
                        (transfer) => transfer.event === parseInt(selectedGw)
                      )
                      .map((transfer) =>
                        getPlayerWebName(bssData.elements[transfer.element_in])
                      )
                      .join(", ")}
              </TableCell>
              <TableCell>
                {manager.gw_team.active_chip === "freehit"
                  ? "*Freehit*"
                  : manager.gw_team.active_chip === "wildcard"
                  ? "*Wildcard*"
                  : manager.transfers
                      .filter(
                        (transfer) => transfer.event === parseInt(selectedGw)
                      )
                      .map((transfer) =>
                        getPlayerWebName(bssData.elements[transfer.element_out])
                      )
                      .join(", ")}
              </TableCell>
              <TableCell>
                {manager.gw_team.entry_history.event_transfers_cost !== 0
                  ? manager.gw_team.entry_history.event_transfers_cost
                  : null}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </CardWithTable>
  );
};
export default Transfers;
