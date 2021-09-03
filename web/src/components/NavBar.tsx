import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import ListAltIcon from "@material-ui/icons/ListAlt";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import theme from "../theme";
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
    text: "Standings",
  },
  {
    icon: <InsertChartIcon style={navStyles} />,
    text: "Data",
  },
];

interface NavBarProps extends Pick<DefaultProps, "league" | "selectedGW"> {
  setPage: any;
  page: string;
}
const NavBar: React.FC<NavBarProps> = ({
  page,
  setPage,
  league,
  selectedGW,
}) => {
  return (
    <>
      <Grid
        container
        maxWidth="lg"
        style={{
          backgroundColor: theme.palette.background.default,
          paddingRight: 60,
          position: "fixed",
          top: 0,
          paddingBlock: 10,
        }}
      >
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          item
          xs={2}
        >
          <img
            src="logo192.png"
            alt="logo"
            style={{ maxHeight: "75%", maxWidth: "75%" }}
          />
        </Grid>
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          item
          xs={10}
          md={5}
        >
          <Typography style={{}} variant="h5">
            {`${league.league.name}, Gameweek ${selectedGW}`}
          </Typography>
        </Grid>
        <Grid
          item
          justifyContent="center"
          alignItems="center"
          display={{ xs: "none", md: "flex" }}
          md={5}
        >
          <Tabs
            value={page}
            onChange={(_event, newValue) => {
              setPage(newValue);
            }}
          >
            {navLinks.map((navlink) => (
              <Tab
                value={navlink.text.toLowerCase()}
                icon={navlink.icon}
                label={navlink.text}
              />
            ))}
          </Tabs>
        </Grid>
      </Grid>
      {/* Bottom */}
      <Box display={{ md: "none" }}>
        <BottomNavigation
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
          }}
          value={page}
          onChange={(event, newValue) => {
            setPage(newValue);
          }}
          showLabels
        >
          {navLinks.map((navlink) => (
            <BottomNavigationAction
              value={navlink.text.toLowerCase()}
              label={navlink.text}
              icon={navlink.icon}
            />
          ))}
        </BottomNavigation>
      </Box>
      {/* <Grid
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
          <Box
            onClick={() => setPage(obj.text.toLowerCase())}
            style={{ cursor: "pointer" }}
            key={obj.text}
            marginTop="auto"
          >
            <Box display="flex">{obj.icon}</Box>
            <Box>{obj.text}</Box>
          </Box>
        ))}
      </Grid> */}
    </>
  );
};
export default NavBar;
