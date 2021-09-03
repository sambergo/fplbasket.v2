import { Card, CardContent, Table, TableContainer } from "@material-ui/core";
import React from "react";

interface CardWithTableProps {}

const CardWithTable: React.FC<CardWithTableProps> = ({ children }) => {
  return (
    <Card
      variant="elevation"
      style={{ marginBottom: "20px", borderRadius: "5px" }}
    >
      <CardContent>
        <TableContainer>
          <Table>{children}</Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
export default CardWithTable;
