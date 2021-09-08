import { Box } from "@material-ui/core";
import { useState } from "react";
import Captains from "./components/Captains";
import Chips from "./components/Chips";
import NavBar from "./components/NavBar";
import Players from "./components/Players";
import Standings from "./components/Standings";
import Transfers from "./components/Transfers";

type PageType = "main" | "transfers" | "standings" | "data";

const League: React.FC = () => {
  const [page, setPage] = useState<PageType>("main");
  const pageToShow = (page: PageType) => {
    switch (page) {
      case "main":
        return (
          <>
            <Chips />
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
