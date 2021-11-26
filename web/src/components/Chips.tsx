import {
  CardHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React from "react";
import { useStateValue } from "../state";
import CardWithTable from "./CardWithTable";

export const getChipName = (chip: string): string => {
  switch (chip) {
    case "wildcard":
      return "Wildcard";
    case "3xc":
      return "Triple Captain";
    case "freehit":
      return "Freehit";
    case "bboost":
      return "Bench Boost";
    default:
      return "";
  }
};
const Chips: React.FC = () => {
  const [{ bssData, leagueData }] = useStateValue();
  if (
    !bssData ||
    !leagueData?.parsedData ||
    leagueData.parsedData.chips.length < 1
  )
    return null;
  return (
    <CardWithTable
      header={
        <CardHeader title={"Chips played"} style={{ textAlign: "center" }} />
      }
    >
      <TableHead>
        <TableRow>
          <TableCell>Chip</TableCell>
          <TableCell>Used by</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {leagueData.parsedData.chips.map((c) => {
          return (
            <TableRow key={c.chip}>
              <TableCell>{getChipName(c.chip)}</TableCell>
              <TableCell>{c.usedBy.join(", ")}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </CardWithTable>
  );
};
export default Chips;
