import { Box, Typography } from "@material-ui/core";
import React from "react";
import { DataType } from "./types/data";
import { LeagueType } from "./types/league";

interface LeagueProps {
  bssData: DataType | undefined;
  leagueId: string;
  setleagueId: React.Dispatch<React.SetStateAction<string>>;
  selectedGW: number;
  setselectedGW: any;
  gws: DataType["events"];
  setleague: React.Dispatch<React.SetStateAction<LeagueType | null>>;
  league: LeagueType;
}

const League: React.FC<LeagueProps> = ({
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
  return (
    <>
      <Box sx={{ my: 4 }} style={{ display: "flex", marginTop: "10%" }}>
        <img
          src="logo512.png"
          alt="logo"
          style={{ margin: "auto", maxHeight: "20%", maxWidth: "20%" }}
        />
        <Typography component="h2" variant="h5">
          {`${league.league.name}, Gameweek ${selectedGW}`}
        </Typography>
      </Box>
    </>
  );
};
export default League;
