import { Box } from "@material-ui/core";
import { useState } from "react";
import Captains from "./components/Captains";
import NavBar from "./components/NavBar";
import Players from "./components/Players";
import Standings from "./components/Standings";
import Transfers from "./components/Transfers";
import { DefaultProps } from "./types/props";

// interface LeagueProps {
//   bssData: DataType | undefined;
//   leagueId: string;
//   setleagueId: React.Dispatch<React.SetStateAction<string>>;
//   selectedGW: number;
//   setselectedGW: any;
//   gws: DataType["events"];
//   setleague: React.Dispatch<React.SetStateAction<LeagueType | null>>;
//   league: LeagueType;
// }

const League: React.FC<DefaultProps> = ({
  bssData,
  league,
  leagueId,
  setleagueId,
  selectedGW,
  setleague,
  setselectedGW,
  gws,
}) => {
  console.log("LEAGUE PAGE");
  type PageType = "main" | "transfers" | "standings" | "data";
  const [page, setPage] = useState<PageType>("main");

  const pageToShow = (page: PageType) => {
    switch (page) {
      case "main":
        return (
          <>
            <Captains
              league={league}
              gws={gws}
              bssData={bssData}
              leagueId={leagueId}
              selectedGW={selectedGW}
              setselectedGW={setselectedGW}
            />
            <Players
              league={league}
              gws={gws}
              bssData={bssData}
              leagueId={leagueId}
              selectedGW={selectedGW}
              setselectedGW={setselectedGW}
            />
          </>
        );
      case "transfers":
        return <Transfers bssData={bssData} league={league} />;
      case "standings":
        return <Standings bssData={bssData} league={league} />;
      default:
        return null;
    }
  };
  return (
    <>
      <NavBar
        page={page}
        setPage={setPage}
        league={league}
        selectedGW={selectedGW}
      />
      <Box marginTop={30}>{pageToShow(page)}</Box>
    </>
  );
};
export default League;
