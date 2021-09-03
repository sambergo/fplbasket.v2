import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Box } from "@material-ui/system";
import { getLeague } from "./service";
import { LeagueType } from "./types/league";
import { LeagueFetchType } from "./types/leagueFetchType";
import { DefaultProps } from "./types/props";

// interface LandingProps {
//   bssData: DataType | undefined;
//   leagueId: string;
//   setleagueId: React.Dispatch<React.SetStateAction<string>>;
//   selectedGW: number;
//   setselectedGW: any;
//   gws: DataType["events"];
//   setleague: React.Dispatch<React.SetStateAction<LeagueType | null>>;
// }

const Landing: React.FC<Omit<DefaultProps, "league">> = ({
  leagueId,
  setleagueId,
  selectedGW,
  setleague,
  setselectedGW,
  gws,
}) => {
  const fetchLeague = async (gw: number, leagueId: string) => {
    // 707422
    if (gw == undefined) return;
    if (!leagueId) return;
    const params: LeagueFetchType = { gw: gw.toString(), leagueId };
    const leagueRequest = await getLeague(params);
    console.log("res leaguee : ", leagueRequest);
    if (leagueRequest.status == 200) {
      const league: LeagueType = leagueRequest.data;
      setleague(league);
    }
  };

  return (
    <>
      <Box sx={{ my: 4 }} style={{ display: "flex", marginTop: "10%" }}>
        <img
          src="logo512.png"
          alt="logo"
          style={{ margin: "auto", maxWidth: "80%" }}
        />
      </Box>
      <Box
        sx={{ my: 4 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          LIIGA
        </Typography>
        {/* <OutlinedInput
          fullWidth
          id="leagueId"
          label="League ID"
          name="leagueId"
          style={{ width: 300 }}
          onChange={(e) => setleagueId(e.target.value)}
        />
        <Select
          id="gw"
          value={selectedGW}
          style={{ width: 300 }}
          onChange={(e) => setselectedGW(e.target.value)}
        >
          {gws.map((gw) => {
            return <MenuItem value={gw.id}> {gw.id} </MenuItem>;
          })}
        </Select> */}

        <FormControl margin="normal" variant="filled" style={{ width: 300 }}>
          <TextField
            variant="outlined"
            fullWidth
            id="leagueId"
            label="League ID"
            name="leagueId"
            onChange={(e) => setleagueId(e.target.value)}
          />
        </FormControl>
        <FormControl margin="normal" variant="outlined" style={{ width: 300 }}>
          <InputLabel id="gw">Gameweek</InputLabel>
          <Select
            labelId="gw"
            id="gw"
            label="Gameweek"
            value={selectedGW}
            onChange={(e) => setselectedGW(e.target.value)}
          >
            {gws.map((gw) => {
              return (
                <MenuItem key={gw.id} value={gw.id}>
                  {" "}
                  {gw.id}{" "}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button onClick={() => fetchLeague(selectedGW, leagueId)}>Go</Button>
      </Box>
    </>
  );
};
export default Landing;
