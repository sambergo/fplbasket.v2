import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@material-ui/core";
import { Box } from "@material-ui/system";
import { FC, useState } from "react";
import { useStateValue } from "../state";
import { getElementType, getPlayerName } from "../tools";
import { Manager } from "../types/newleague";
import CompareGrid from "./CompareGrid";

interface CompareManagerType {
  manager: Manager;
}

const CompareManager: FC<CompareManagerType> = ({ manager }) => {
  const [enemy, setEnemy] = useState<Manager | null>(null);
  const [{ leagueData, bssData }] = useStateValue();
  const handleChange = (event: SelectChangeEvent) => {
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
              variant="standard"
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
            <Grid container marginTop={5}>
              <Grid item container display="flex" justifyContent="left">
                <CompareGrid
                  headerText={manager.player_name}
                  team1={manager}
                  team2={enemy}
                />
                <CompareGrid
                  headerText={enemy.player_name}
                  team1={enemy}
                  team2={manager}
                />
                <Grid xs={12} sm={6} md={4} item direction="column">
                  <Typography variant="h6">Mutual</Typography>
                  {enemy.gw_team.picks
                    .filter((pick) =>
                      manager.gw_team.picks
                        .map((ep) => ep.element)
                        .includes(pick.element)
                    )
                    .sort(
                      (a, b) =>
                        getElementType(bssData?.elements[a.element]) -
                        getElementType(bssData?.elements[b.element])
                    )
                    .map((pick) => (
                      <Typography key={pick.element} variant="body2">
                        {getPlayerName(bssData?.elements[pick.element] || null)}
                      </Typography>
                    ))}
                </Grid>
              </Grid>
            </Grid>
          ) : null}
        </CardContent>
      </Card>
    </Box>
  );
};
export default CompareManager;
