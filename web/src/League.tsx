import { Box } from "@material-ui/core";
import { useState } from "react";
import Captains from "./components/Captains";
import NavBar from "./components/NavBar";
import Players from "./components/Players";
import Standings from "./components/Standings";
import Transfers from "./components/Transfers";
import { useStateValue } from "./state";

type PageType = "main" | "transfers" | "standings" | "data";

const League: React.FC = () => {
  // const [{ bssData, leagueData, gwsData }] = useStateValue();
  const [page, setPage] = useState<PageType>("main");
  const pageToShow = (page: PageType) => {
    switch (page) {
      case "main":
        return (
          <>
            <Captains />
            <Players />
          </>
        );
      case "transfers":
        return <Transfers />;
      case "standings":
        return <Standings />;
      default:
        return null;
    }
  };
  return (
    <>
      <NavBar page={page} setPage={setPage} />
      <Box marginTop={20}>{pageToShow(page)}</Box>
    </>
  );
};
export default League;
