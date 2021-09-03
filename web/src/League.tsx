import { Box } from "@material-ui/core";
import { useState } from "react";
import Captains from "./components/Captains";
import NavBar from "./components/NavBar";
import Players from "./components/Players";
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
  type PageType = "main" | "transfers" | "table" | "data";
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
        return <Transfers />;
      default:
        return null;
    }
  };
  return (
    <>
      <NavBar setPage={setPage} league={league} selectedGW={selectedGW} />
      <Box marginTop="60px">{pageToShow(page)}</Box>
    </>
  );
};
export default League;
