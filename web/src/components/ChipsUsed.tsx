import {
  CardHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Box } from "@material-ui/system";
import { FC } from "react";
import { useStateValue } from "../state";
import theme from "../theme";
import { Manager } from "../types/newleague";
import CardWithTable from "./CardWithTable";
import { getChipName } from "./Chips";

interface ChipsUsedType {
  manager: Manager;
}

const ChipsUsed: FC<ChipsUsedType> = ({ manager }) => {
  const [{ selectedGw }] = useStateValue();
  return (
    <Box>
      <CardWithTable
        header={
          <CardHeader
            title={"Chips used"}
            style={{ textAlign: "center" }}
          ></CardHeader>
        }
      >
        <TableHead>
          <TableRow>
            <TableCell>GW</TableCell>
            <TableCell>Chip</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {manager.history.chips.map((chip) => {
            if (chip.event === parseInt(selectedGw)) {
              return (
                <TableRow
                  style={{ backgroundColor: theme.palette.secondary.main }}
                  key={chip.event}
                >
                  <TableCell>{chip.event}</TableCell>
                  <TableCell>{getChipName(chip.name || "")}</TableCell>
                </TableRow>
              );
            }
            return (
              <TableRow key={chip.event}>
                <TableCell>{chip.event}</TableCell>
                <TableCell>{getChipName(chip.name || "")}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </CardWithTable>
    </Box>
  );
};
export default ChipsUsed;
