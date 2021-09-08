import { Box } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { useEffect } from "react";
import Landing from "./Landing";
import League from "./League";
import { getBssData } from "./service";
import { useStateValue } from "./state";
import { DataType } from "./types/data";

export default function App() {
  const [{ bssData, leagueData }, dispatch] = useStateValue();
  useEffect(() => {
    const fetchBssData = async () => {
      const bssRequest = await getBssData();
      if (bssRequest.status == 200 && bssRequest.data) {
        const data: DataType = bssRequest.data;
        dispatch({ type: "SET_BSS_DATA", payload: data });
      } else alert("The game is being updated.");
    };
    fetchBssData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box height="100vh">{leagueData ? <League /> : <Landing />}</Box>
    </Container>
  );
}
