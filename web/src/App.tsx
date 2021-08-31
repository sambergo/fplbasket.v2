import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { useEffect, useState } from "react";
import { DataType } from "./types/data";

const getGWs = (events: DataType["events"]) => {
  let gws = events.filter((e) => e.finished);
  const delay = 20 * 60 * 1000;
  for (let e of events) {
    // @ts-ignore
    const dd_diff = new Date() - new Date(e.deadline_time);
    if (!e.finished && dd_diff > delay) {
      gws.push(e);
    }
  }
  return gws.reverse();
};

interface LeagueFetchType {
  gw: string;
  leagueId: string;
}

export default function App() {
  const [bssData, setbssData] = useState<DataType>();
  const [gws, setgws] = useState<DataType["events"]>([]);
  const [selectedGW, setselectedGW] = useState<DataType["events"][0]>();
  const [leagueId, setleagueId] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://localhost:3636/api/data")
      .then((res) => {
        console.log("res : ", res);
        if (res.status == 200) {
          const data: DataType = res.data;
          setbssData(data);
          const filteredGWs = getGWs(data.events);
          setgws(filteredGWs);
          setselectedGW(filteredGWs[0]);
        }
      })
      .catch((err) => console.log("err : ", err));
  }, []);
  const fetchLeague = (
    gw: DataType["events"][0] | undefined,
    leagueId: string
  ) => {
    // 707422
    if (gw == undefined) return;
    const params: LeagueFetchType = { gw: gw.id.toString(), leagueId };
    axios.post("http://localhost:3636/api/league", params).then((res) => {
      console.log("res leaguee : ", res);
    });
  };
  return (
    <Container maxWidth="lg">
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
        <FormControl variant="filled" style={{ width: 300 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="leagueId"
            label="League ID"
            name="leagueId"
            autoComplete="leagueIdsda"
            onChange={(e) => setleagueId(e.target.value)}
          />
        </FormControl>
        <FormControl variant="filled" style={{ width: 300 }}>
          <InputLabel id="gw">Gameweek</InputLabel>
          <Select
            labelId="gw"
            id="gw"
            label="Gameweek"
            // value={age}
            onChange={(e) =>
              setselectedGW(gws.find((gw) => gw.id == e.target.value))
            }
          >
            {gws.map((gw) => {
              return <MenuItem value={gw.id}> {gw.id} </MenuItem>;
            })}
            {/* <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem> */}
          </Select>
        </FormControl>
        <Button onClick={() => fetchLeague(selectedGW, leagueId)}>Go</Button>
      </Box>
    </Container>
  );
}
