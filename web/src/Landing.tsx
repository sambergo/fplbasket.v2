import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Box } from "@material-ui/system";
import { getLeague } from "./service";
import { LeagueFetchType } from "./types/leagueFetchType";
import { DefaultProps } from "./types/props";
import HelpIcon from "@material-ui/icons/Help";
import React, { useEffect, useState } from "react";

const Landing: React.FC<Omit<DefaultProps, "league">> = ({
  leagueId,
  setleagueId,
  selectedGW,
  setleague,
  setselectedGW,
  gws,
}) => {
  const [displayUrl, setDisplayUrl] = useState<boolean>(false);
  const fetchLeague = async (gw: number, leagueId: string) => {
    // 707422
    if (!gw || !leagueId) return;
    const params: LeagueFetchType = { gw: gw.toString(), leagueId };
    const leagueRequest = await getLeague(params);
    console.log("res leaguee : ", leagueRequest);
    if (leagueRequest.status == 200 && leagueRequest.data) {
      const league: LeagueType = leagueRequest.data;
      setleague(league);
      window.localStorage.setItem("usersPreviousLeagueID", leagueId);
    }
  };

  return (
    <>
      <Box sx={{ my: 4 }} style={{ display: "flex", marginTop: "10%" }}>
        <img
          src="logo512.png"
          alt="logo"
          style={{ margin: "auto", maxWidth: "500px", width: "75%" }}
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
        <Box
          style={{
            width: 300,
            height: 20,
          }}
        >
          {displayUrl ? (
            <img src="urlpic.png" alt="urlpic" style={{ maxWidth: 300 }} />
          ) : null}
        </Box>
        <FormControl margin="normal" variant="filled" style={{ width: 300 }}>
          <TextField
            InputProps={{
              endAdornment: (
                <Box>
                  <HelpIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => setDisplayUrl(!displayUrl)}
                  />
                </Box>
              ),
            }}
            id="leagueId"
            value={leagueId}
            label="League ID"
            onChange={(e) => setleagueId(e.target.value)}
          />
        </FormControl>
        <FormControl margin="normal" variant="outlined" style={{ width: 300 }}>
          <InputLabel id="gw">Gameweek</InputLabel>
          <Select
            labelId="gw"
            id="gw"
            label="Gameweek"
            value={selectedGW.toString()}
            defaultValue=""
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
        <Button
          style={{ marginTop: 15 }}
          size="large"
          variant="contained"
          onClick={() => fetchLeague(selectedGW, leagueId)}
        >
          Go!
        </Button>
      </Box>
    </>
  );
};
export default Landing;
