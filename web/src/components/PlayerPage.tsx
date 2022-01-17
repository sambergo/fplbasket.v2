import {
  Button,
  CardHeader,
  Grid,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { useStateValue } from "../state";
import { getPlayerName } from "../tools";
import { PlayerPick } from "../types/newleague";
import CardWithTable from "./CardWithTable";

interface PlayerPageProps {
  playerPick: PlayerPick;
}
const PlayerPage: React.FC<PlayerPageProps> = ({ playerPick }) => {
  const [{ bssData, liveData }] = useStateValue();
  const stats = liveData?.elements[playerPick.element]?.explain;
  if (!bssData?.elements || !stats) return null;
  return (
    <>
      <CardWithTable
        header={
          <Grid container>
            <Grid
              item
              xs={3}
              display="flex"
              justifyContent="left"
              alignItems="center"
            >
              <Button variant="contained">Back</Button>
            </Grid>
            <Grid item xs={6}>
              <CardHeader
                title={getPlayerName(bssData.elements[playerPick.element])}
                style={{ textAlign: "center" }}
              />
            </Grid>
            <Grid
              item
              xs={3}
              display="flex"
              direction="column"
              justifyContent="center"
              alignItems="center"
            ></Grid>
          </Grid>
        }
      >
        {stats.map((stat) => {
          const fixture = liveData.fixtures[stat.fixture];
          const home = bssData.teams.find((team) => team.id == fixture?.team_h);
          const away = bssData.teams.find((team) => team.id == fixture?.team_a);
          return (
            <>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={3}>
                    {home?.name} - {away?.name}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stat.stats.map((statObj) => {
                  return (
                    <>
                      <TableRow>
                        <TableCell>{statObj.identifier}</TableCell>
                        <TableCell>{statObj.value}</TableCell>
                        <TableCell>{statObj.points}</TableCell>
                      </TableRow>
                    </>
                  );
                })}
                <TableRow>
                  <TableCell>Bonus (Live!)</TableCell>
                  <TableCell></TableCell>
                  {/* <TableCell>{liveData.elements[playerPick.element]}</TableCell> */}
                </TableRow>
              </TableBody>
            </>
          );
        })}
      </CardWithTable>
    </>
  );
};

export default PlayerPage;
