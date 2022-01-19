import {
  Button,
  CardHeader,
  Grid,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import { useStateValue } from "../state";
import { PlayerPick } from "../types/newleague";
import CardWithTable from "./CardWithTable";

interface PlayerPageProps {
  playerPick: PlayerPick;
}
const PlayerPage: React.FC<PlayerPageProps> = ({ playerPick }) => {
  const [{ bssData, liveData }] = useStateValue();
  const stats = liveData?.elements[playerPick.element]?.explain;
  const liveBps = liveData?.elements[playerPick.element]?.live_bps;
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
                title={
                  bssData.elements[playerPick.element].first_name +
                  " " +
                  bssData.elements[playerPick.element].second_name
                }
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
              <CardHeader
                title={`${home?.name} - ${away?.name}`}
                style={{ textAlign: "left" }}
              />
              <TableBody>
                {stat.stats.map((statObj) => {
                  return (
                    <>
                      <TableRow>
                        <TableCell>
                          {statObj.identifier.charAt(0).toUpperCase() +
                            statObj.identifier.slice(1).replace("_", " ")}
                        </TableCell>
                        <TableCell>{statObj.value}</TableCell>
                        <TableCell>{statObj.points}</TableCell>
                      </TableRow>
                    </>
                  );
                })}
                {liveBps ? (
                  <TableRow>
                    <TableCell>Bonus (Live!)</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{liveBps}</TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </>
          );
        })}
      </CardWithTable>
    </>
  );
};

export default PlayerPage;
