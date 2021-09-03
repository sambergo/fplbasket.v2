import { Box, Grid, Link, Typography } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import ListAltIcon from "@material-ui/icons/ListAlt";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import { DefaultProps } from "../types/props";

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

interface NavBarProps extends Pick<DefaultProps, "league" | "selectedGW"> {
  setPage: any;
}
const NavBar: React.FC<NavBarProps> = ({ setPage, league, selectedGW }) => {
  return (
    <>
      <Grid
        style={{
          marginTop: "15px",
        }}
        container
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
        >
          {navLinks.map((obj) => (
            <Grid
              onClick={() => setPage(obj.text.toLowerCase())}
              key={obj.text}
              style={{ cursor: "pointer" }}
              item
              container
              xs={3}
              justifyContent="left"
            >
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
          <Box key={obj.text} marginTop="auto">
            <Box display="flex">{obj.icon}</Box>
            <Box>{obj.text}</Box>
          </Box>
        ))}
      </Grid>
    </>
  );
};
export default NavBar;
