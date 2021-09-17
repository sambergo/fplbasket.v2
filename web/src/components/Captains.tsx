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

const Captains: React.FC = () => {
  const [{ bssData, leagueData }] = useStateValue();
  if (!bssData || !leagueData?.parsedData) return null;
  return (
    <CardWithTable
      header={<CardHeader title={"Captains"} style={{ textAlign: "center" }} />}
    >
      <TableHead>
        <TableRow>
          <TableCell>Captain</TableCell>
          <TableCell>Owners</TableCell>
          <TableCell>#</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {leagueData.parsedData.captains.map((c) => {
          return (
            <TableRow key={c.captain}>
              <TableCell>
                {getPlayerWebName(bssData.elements[c.captain])}
              </TableCell>
              <TableCell>{c.captainedBy.join(", ")}</TableCell>
              <TableCell>{c.captainedBy.length} </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </CardWithTable>
  );
};
export default Captains;
