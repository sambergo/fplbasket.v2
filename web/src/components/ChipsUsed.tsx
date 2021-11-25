import {
  CardHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { Box } from "@material-ui/system";
import { FC, useEffect, useState } from "react";
import { getTeamForChips } from "../service";
import { Manager, GwTeam } from "../types/newleague";
import CardWithTable from "./CardWithTable";
import { getChipName } from "./Chips";

interface ChipsUsedType {
  manager: Manager;
}

const ChipsUsed: FC<ChipsUsedType> = ({ manager }) => {
  const [managerChips, setManagerChips] = useState<GwTeam[]>();
  useEffect(() => {
    const getteamdata = async () => {
      const id = manager.entry.toString();
      const chipsReq = await getTeamForChips({ id });
      if (chipsReq.status == 200 && chipsReq.data) {
        const data: GwTeam[] = chipsReq.data;
        setManagerChips(data.filter((gw) => gw.active_chip));
      }
    };
    getteamdata();
  }, []);

  if (!managerChips) {
    return null;
  }

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
          {managerChips
            ?.filter((gw) => gw.active_chip)
            .map((gw) => {
              return (
                <TableRow>
                  <TableCell>{gw.entry_history.event}</TableCell>
                  <TableCell>{getChipName(gw.active_chip || "")}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </CardWithTable>
    </Box>
  );
};
export default ChipsUsed;
