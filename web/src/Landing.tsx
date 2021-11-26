import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import { Box } from "@material-ui/system";
import React, { useEffect, useState } from "react";
import { getLeague, getLiveElements } from "./service";
import { useStateValue } from "./state";
import { LeagueFetchType, LiveFetchType } from "./types/fetchTypes";
import { LiveElement } from "./types/liveElements";
import { CurrPrevAndParsedLeague } from "./types/newleague";

const Landing: React.FC = () => {
  const [{ gwsData, selectedGw }, dispatch] = useStateValue();
  const [displayUrl, setDisplayUrl] = useState<boolean>(false);
  const [leagueId, setLeagueId] = useState<string>("");
  const [userSelectedGW, setUserSelectedGW] = useState<string>(selectedGw);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchLeague = async (gw: number, leagueId: string) => {
    if (!gw || !leagueId) return;
    try {
      const params: LiveFetchType = { gw: gw.toString() };
      const liveRequest = await getLiveElements(params);
      if (liveRequest.status == 200 && liveRequest.data) {
        const liveElements: LiveElement[] = liveRequest.data;
        dispatch({ type: "SET_LIVE_ELEMENTS", payload: liveElements });
      }
    } catch (error) {
      console.log("error:", error);
    }
    try {
      setLoading(true);
      const params: LeagueFetchType = { gw: gw.toString(), leagueId };
      const leagueRequest = await getLeague(params);
      if (leagueRequest.status == 200 && leagueRequest.data) {
        const league: CurrPrevAndParsedLeague = leagueRequest.data;
        if (userSelectedGW)
          dispatch({ type: "SET_SELECTED_GW", payload: userSelectedGW });
        window.localStorage.setItem("usersPreviousLeagueID", leagueId);
        setLoading(false);
        dispatch({ type: "SET_LEAGUE_DATA", payload: league });
      }
    } catch {
      alert("No league found or FPL is being updated");
      setLoading(false);
    }
  };

  useEffect(() => {
    const usersPreviousId = window.localStorage.getItem(
      "usersPreviousLeagueID"
    );
    if (usersPreviousId) setLeagueId(usersPreviousId);
  }, []);

  useEffect(() => {
    setUserSelectedGW(selectedGw);
    const idFromBrowser = window.location.pathname.match(/[0-9]/g);
    if (idFromBrowser) {
      fetchLeague(parseInt(selectedGw), idFromBrowser.join("").toString());
    }
  }, [selectedGw]);

  return (
    <>
      <Box sx={{ my: 4 }} style={{ display: "flex", marginTop: "10%" }}>
        <img
          src="/images/logo512.png"
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
            <img
              src="/images/urlpic.png"
              alt="urlpic"
              style={{ maxWidth: 300 }}
            />
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
            onKeyPress={(e) => {
              if (e.key === "Enter")
                fetchLeague(parseInt(userSelectedGW), leagueId);
            }}
            value={leagueId}
            label="League ID"
            onChange={(e) => setLeagueId(e.target.value)}
          />
        </FormControl>
        <FormControl margin="normal" variant="outlined" style={{ width: 300 }}>
          <InputLabel id="gw">Gameweek</InputLabel>
          <Select
            labelId="gw"
            id="gw"
            label="Gameweek"
            value={userSelectedGW.toString()}
            defaultValue=""
            onChange={(e) => setUserSelectedGW(e.target.value)}
          >
            {gwsData.map((gw) => {
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
          disabled={loading}
          size="large"
          variant="contained"
          onClick={() => fetchLeague(parseInt(userSelectedGW), leagueId)}
        >
          {loading ? "Loading..." : "Go!"}
        </Button>
      </Box>
    </>
  );
};
export default Landing;
