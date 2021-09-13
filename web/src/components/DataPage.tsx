import CardWithTable from "./CardWithTable";
import {
  CardHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { useStateValue } from "../state";

const DataPage: React.FC<{}> = () => {
  const [{ leagueData }] = useStateValue();
  return (
    <CardWithTable
      header={
        <CardHeader title={"Team values"} style={{ textAlign: "center" }} />
      }
    >
      <TableHead>
        <TableCell>Manager</TableCell>
        <TableCell>Value</TableCell>
      </TableHead>
      <TableBody>
        {leagueData?.parsedData.managers
          .sort(
            (a, b) =>
              b.manager.gw_team.entry_history.value -
              a.manager.gw_team.entry_history.value
          )
          .map((manager) => {
            return (
              <TableRow>
                <TableCell>{manager.manager.player_name}</TableCell>
                <TableCell>
                  {(manager.manager.gw_team.entry_history.value / 10).toFixed(
                    1
                  )}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </CardWithTable>
  );
};

export default DataPage;
