import { Box, Grid, Typography } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { DataType } from "./types/data";
import { LeagueType } from "./types/league";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import ListAltIcon from "@material-ui/icons/ListAlt";
import Captains from "./components/Captains";
import Players from "./components/Players";

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

  const navStyles = { margin: "auto" };
  const navLinks = [
    {
      icon: <HomeIcon style={navStyles} />,
      text: "Main",
    },
    {
      icon: <SwapHorizIcon style={navStyles} />,
      text: "Transfers",
    },
    {
      icon: <ListAltIcon style={navStyles} />,
      text: "Table",
    },
    {
      icon: <InsertChartIcon style={navStyles} />,
      text: "Data",
    },
  ];
  return (
    <>
      <Grid
        style={{
          marginTop: "15px",
          // border: "2px solid green",
          // backgroundColor: "#222b36",
          // color: "#919eab",
        }}
        container
        // spacing={2}
        justifyContent="space-between"
      >
        <Grid item xs={2} style={{ display: "flex" }}>
          <img
            src="logo512.png"
            alt="logo"
            style={{ marginBlock: "auto", maxHeight: "75%", maxWidth: "75%" }}
          />
        </Grid>
        <Grid
          md={5}
          item
          container
          display={{ md: "inherit", sm: "none", xs: "none" }}
          direction="row"
          justifyContent="left"
          // style={{ border: "1px solid black" }}
        >
          {navLinks.map((obj) => (
            <Grid key={obj.text} item container xs={3} justifyContent="left">
              <Grid item container direction="column" justifyContent="center">
                <Grid item display="flex">
                  {obj.icon}
                </Grid>
                <Grid marginX="auto" item>
                  {obj.text}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Grid
          item
          xs={10}
          md={5}
          justifyContent="center"
          style={{ display: "flex" }}
        >
          <Typography
            component="h2"
            variant="h5"
            style={{ marginBlock: "auto" }}
          >
            {`${league.league.name}, Gameweek ${selectedGW}`}
          </Typography>
        </Grid>
      </Grid>
      {/* YLÄPALKKI */}
      <Grid
        container
        justifyContent="space-evenly"
        display={{ md: "none" }}
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        style={{
          backgroundColor: "#222b36",
          color: "#919eab",
          height: "60px",
        }}
      >
        {navLinks.map((obj) => (
          <Box marginTop="auto">
            <Box display="flex">{obj.icon}</Box>
            <Box>{obj.text}</Box>
          </Box>
        ))}
      </Grid>
      <Box marginTop="60px">
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
      </Box>
    </>
  );
};
export default League;
