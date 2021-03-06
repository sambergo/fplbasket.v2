import {
  Button,
  CardHeader,
  Grid,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import { useStateValue } from "../state";
import { navBarBgColor } from "../theme";
import { getElementPoints } from "../tools";
import { PlayerPick } from "../types/newleague";
import CardWithTable from "./CardWithTable";

interface PlayerPageProps {
  playerPick: PlayerPick;
  setPlayerPick: React.Dispatch<React.SetStateAction<PlayerPick | null>>;
}
const PlayerPage: React.FC<PlayerPageProps> = ({
  playerPick,
  setPlayerPick,
}) => {
  const [{ bssData, liveData, leagueData, showLiveBonus }] = useStateValue();
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
              <Button onClick={() => setPlayerPick(null)} variant="contained">
                Back
              </Button>
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
        {stats.map((stat, i) => {
          const fixture = liveData.fixtures[stat.fixture];
          const home = bssData.teams.find((team) => team.id == fixture?.team_h);
          const away = bssData.teams.find((team) => team.id == fixture?.team_a);
          return (
            <TableBody key={i}>
              {/* {i === 0 ? ( */}
              <TableRow>
                <TableCell style={{ borderBottom: 0 }}>
                  <CardHeader
                    title={`${home?.name} - ${away?.name}`}
                    style={{ textAlign: "left" }}
                  />
                </TableCell>
                <TableCell style={{ borderBottom: 0 }}>Amount</TableCell>
                <TableCell style={{ borderBottom: 0 }}>Points</TableCell>
              </TableRow>
              {/* ) : null} */}
              {stat.stats
                .filter((so) => showLiveBonus || so.identifier !== "live_bonus")
                .map((statObj) => {
                  return (
                    <TableRow key={statObj.identifier}>
                      <TableCell>
                        {statObj.identifier.charAt(0).toUpperCase() +
                          statObj.identifier.slice(1).replace("_", " ")}
                      </TableCell>
                      <TableCell>{statObj.value}</TableCell>
                      <TableCell>{statObj.points}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          );
        })}
        <TableBody>
          <TableRow>
            <TableCell style={{ borderBottom: 0 }}></TableCell>
            <TableCell style={{ borderBottom: 0 }}></TableCell>
            <TableCell style={{ borderBottom: 0 }}></TableCell>
          </TableRow>
          <TableRow style={{ backgroundColor: navBarBgColor }}>
            <TableCell style={{ borderBottom: 0 }}>Total</TableCell>
            <TableCell style={{ borderBottom: 0 }}></TableCell>
            <TableCell style={{ borderBottom: 0 }}>
              {getElementPoints(
                liveData.elements[playerPick.element],
                showLiveBonus
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ borderBottom: 0 }}></TableCell>
            <TableCell style={{ borderBottom: 0 }}></TableCell>
            <TableCell style={{ borderBottom: 0 }}></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Owned by</TableCell>
            <TableCell>
              {leagueData?.parsedData.players
                .find((plr) => plr.player === playerPick.element)
                ?.ownedBy.join(", ")}
            </TableCell>
          </TableRow>
        </TableBody>
      </CardWithTable>
    </>
  );
};

export default PlayerPage;
