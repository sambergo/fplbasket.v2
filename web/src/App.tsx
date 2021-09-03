import { Box, CssBaseline } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { useEffect, useState } from "react";
import Landing from "./Landing";
import League from "./League";
import { getBssData } from "./service";
import { DataType } from "./types/data";
import { LeagueType } from "./types/league";

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

export default function App() {
  const [bssData, setbssData] = useState<DataType>();
  const [gws, setgws] = useState<DataType["events"]>([]);
  const [selectedGW, setselectedGW] = useState<number>(1);
  const [leagueId, setleagueId] = useState<string>("");
  const [league, setleague] = useState<LeagueType>();

  useEffect(() => {
    const fetchBssData = async () => {
      const bssRequest = await getBssData();
      if (bssRequest.status == 200 && bssRequest.data) {
        const data: DataType = bssRequest.data;
        setbssData(data);
        const filteredGWs = getGWs(data.events);
        setgws(filteredGWs);
        setselectedGW(filteredGWs[0].id);
      } else alert("The game is being updated.");
    };
    fetchBssData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box
        height="100vh"
        // style={{ border: "2px solid yellow" }}
      >
        {league ? (
          <League
            league={league}
            gws={gws}
            setleague={setleague}
            bssData={bssData}
            leagueId={leagueId}
            setleagueId={setleagueId}
            selectedGW={selectedGW}
            setselectedGW={setselectedGW}
          />
        ) : (
          <Landing
            gws={gws}
            setleague={setleague}
            bssData={bssData}
            leagueId={leagueId}
            setleagueId={setleagueId}
            selectedGW={selectedGW}
            setselectedGW={setselectedGW}
          />
        )}
      </Box>
    </Container>
  );
}
