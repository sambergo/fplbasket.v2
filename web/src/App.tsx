import { Box } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { useEffect } from "react";
import Landing from "./Landing";
import League from "./League";
import { getBssData } from "./service";
import { useStateValue } from "./state";
import { DataType } from "./types/data";

export default function App() {
  //   const [bssData, setbssData] = useState<DataType>();
  //   const [gws, setgws] = useState<DataType["events"]>([]);
  //   const [selectedGW, setselectedGW] = useState<number>(1);
  //   const [leagueId, setleagueId] = useState<string>("");
  //   const [league, setleague] = useState<CurrPrevAndParsedLeague>();
  const [{ bssData, leagueData }, dispatch] = useStateValue();
  useEffect(() => {
    //   const fetchPatientList = async () => {
    //     try {
    //       const { data: patientListFromApi } = await axios.get<Patient[]>(
    //         `${apiBaseUrl}/patients`
    //       );
    //       dispatch({ type: "SET_PATIENT_LIST", payload: patientListFromApi });
    //     } catch (e) {
    //       console.error(e);
    //     }
    //   };
    //   void fetchPatientList();
    // }, [dispatch]);

    const fetchBssData = async () => {
      const bssRequest = await getBssData();
      if (bssRequest.status == 200 && bssRequest.data) {
        const data: DataType = bssRequest.data;
        dispatch({ type: "SET_BSS_DATA", payload: data });
        console.log("bssData:", bssData);
        // setbssData(data);
        // const filteredGWs = getGWs(data.events);
        // setgws(filteredGWs);
        // setselectedGW(filteredGWs[0].id);
      } else alert("The game is being updated.");
    };
    fetchBssData();
    const usersPreviousId = window.localStorage.getItem(
      "usersPreviousLeagueID"
    );
    console.log("usersPreviousId:", usersPreviousId);
    // if (usersPreviousId) setleagueId(usersPreviousId);
  }, []);

  return (
    <Container maxWidth="lg">
      <Box height="100vh">{leagueData ? <League /> : <Landing />}</Box>
    </Container>
  );
}
