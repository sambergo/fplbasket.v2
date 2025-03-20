import { Box, Button, FormControl, TextField } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import React, { useEffect, useState } from "react";
import { getLeague, getLiveElements } from "./service";
import { useStateValue } from "./state";
import { LeagueFetchType, LiveFetchType } from "./types/fetchTypes";
import { LiveData } from "./types/livedata";
import { CurrPrevAndParsedLeague } from "./types/newleague";

const Landing: React.FC = () => {
  const [{ selectedGw }, dispatch] = useStateValue();
  const [displayUrl, setDisplayUrl] = useState<boolean>(false);
  const [leagueId, setLeagueId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchLeague = async (gw: number, leagueId: string) => {
    if (!gw || !leagueId) return;
    try {
      const params: LiveFetchType = { gw: gw.toString() };
      const liveRequest = await getLiveElements(params);
      if (liveRequest.status == 200 && liveRequest.data) {
        const liveData: LiveData = liveRequest.data;
        dispatch({ type: "SET_LIVE_ELEMENTS", payload: liveData });
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
        if (selectedGw)
          dispatch({ type: "SET_SELECTED_GW", payload: selectedGw });
        window.localStorage.setItem("usersPreviousLeagueID", leagueId);
        dispatch({ type: "SET_LEAGUE_DATA", payload: league });
        setLoading(false);
      }
    } catch {
      alert("No league found or FPL is being updated");
      setLoading(false);
    }
  };

  useEffect(() => {
    const usersPreviousId = window.localStorage.getItem(
      "usersPreviousLeagueID",
    );
    if (usersPreviousId) setLeagueId(usersPreviousId);
  }, []);

  useEffect(() => {
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
            onKeyDown={(e) => {
              if (e.key === "Enter")
                fetchLeague(parseInt(selectedGw), leagueId);
            }}
            value={leagueId}
            label="League ID"
            onChange={(e) => setLeagueId(e.target.value)}
          />
        </FormControl>
        <Button
          style={{ marginTop: 15 }}
          disabled={loading}
          size="large"
          variant="contained"
          onClick={() => fetchLeague(parseInt(selectedGw), leagueId)}
        >
          {loading ? "Loading..." : "Go!"}
        </Button>
      </Box>
    </>
  );
};
export default Landing;
