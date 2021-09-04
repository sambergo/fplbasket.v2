import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@material-ui/core";
import React from "react";

interface CardWithTableProps {
  header?: any | null;
}

const CardWithTable: React.FC<CardWithTableProps> = ({
  children,
  header = null,
}) => {
  return (
    <Card
      variant="elevation"
      style={{ marginBottom: "20px", borderRadius: "5px" }}
    >
      <CardContent>
        {header}
        <TableContainer>
          <Table>{children}</Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
export default CardWithTable;
