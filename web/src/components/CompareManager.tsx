import {
  CardHeader,
  TableHead,
  TableRow,
  Table,
  TableContainer,
  TableCell,
  TableBody,
  Card,
  CardContent,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
} from "@material-ui/core";
import { Box } from "@material-ui/system";
import { FC, useState } from "react";
import { useStateValue } from "../state";
import { Manager, ParsedManagerPick } from "../types/newleague";
import CardWithTable from "./CardWithTable";

interface CompareManagerType {
  manager: Manager;
}

const CompareManager: FC<CompareManagerType> = ({ manager }) => {
  const [enemy, setEnemy] = useState<Manager | null>(null);
  const [{ leagueData }] = useStateValue();
  // leagueData?.parsedData.managers.map(m => m.manager.gw_team.picks)
  const handleChange = (event: SelectChangeEvent) => {
    console.log("event ", event.target.value);
    const i: number = parseInt(event.target.value) || 0;
    const newEnemy: Manager | null =
      leagueData?.parsedData.managers[i].manager || null;
    setEnemy(newEnemy);
  };
  return (
    <Box>
      <Card
        variant="elevation"
        style={{ marginBottom: "20px", borderRadius: "5px" }}
      >
        <CardContent>
          <CardHeader
            title={"Compare to"}
            style={{ textAlign: "center" }}
          ></CardHeader>
          <FormControl fullWidth>
            <InputLabel id="compare-id">Select another manager</InputLabel>
            <Select
              labelId="compare-id"
              id="compare-select"
              // value={enemy}
              label="Compare to"
              onChange={handleChange}
            >
              {leagueData?.parsedData?.managers.map((mngrObj, i) => (
                <MenuItem value={i}>{mngrObj.manager.player_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {manager && enemy ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>GW</TableCell>
                    <TableCell>Chip</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody></TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </CardContent>
      </Card>
    </Box>
  );
};
export default CompareManager;
