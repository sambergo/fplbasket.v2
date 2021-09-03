import { TableCell, TableHead, TableRow } from "@material-ui/core";
import React from "react";
import CardWithTable from "./CardWithTable";

interface TransfersProps {}

const Transfers: React.FC<TransfersProps> = ({}) => {
  return (
    <CardWithTable>
      <TableHead>
        <TableRow>
          <TableCell>Manager</TableCell>
          <TableCell>Transfers in</TableCell>
          <TableCell>Transfers out</TableCell>
        </TableRow>
      </TableHead>
    </CardWithTable>
  );
};
export default Transfers;
