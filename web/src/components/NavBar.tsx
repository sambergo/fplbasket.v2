import {
  AppBar,
  BottomNavigationAction,
  Box,
  Grid,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@material-ui/core";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import HomeIcon from "@material-ui/icons/Home";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import ListAltIcon from "@material-ui/icons/ListAlt";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import { useStateValue } from "../state";
// import theme from "../theme";

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

interface NavBarProps {
  setPage: any;
  page: string;
}
const NavBar: React.FC<NavBarProps> = ({ page, setPage }) => {
  const [{ leagueData, selectedGw }, dispatch] = useStateValue();
  if (!leagueData?.league_curr.managers) return null;
  return (
    <>
      <AppBar position="fixed">
        <Toolbar style={{ background: "#203248" }}>
          <img
            onClick={() =>
              dispatch({ type: "RESET_LEAGUE_DATA", payload: null })
            }
            src="logo192.png"
            alt="logo"
            style={{
              maxHeight: "75%",
              maxWidth: 80,
              paddingBlock: 5,
              cursor: "pointer",
            }}
          />
          <Box display={{ xs: "none", md: "flex" }}>
            <Tabs
              style={{ marginLeft: 15 }}
              value={page}
              onChange={(_event, newValue) => {
                setPage(newValue);
              }}
            >
              {navLinks.map((navlink) => (
                <Tab
                  key={navlink.text}
                  value={navlink.text.toLowerCase()}
                  icon={navlink.icon}
                  label={navlink.text}
                />
              ))}
            </Tabs>
          </Box>
          <Typography style={{ marginLeft: "auto" }} variant="h5">
            {`${leagueData?.league_curr.league.name}${
              leagueData?.league_curr.managers.length > 49 ? " (Top 50)" : ""
            }, Gameweek ${selectedGw}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box display={{ md: "none" }}>
        <BottomNavigation
          style={{
            background: "#203248",
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
              key={navlink.text}
              value={navlink.text.toLowerCase()}
              label={navlink.text}
              icon={navlink.icon}
            />
          ))}
        </BottomNavigation>
      </Box>
      {/*
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
                key={navlink.text}
                value={navlink.text.toLowerCase()}
                icon={navlink.icon}
                label={navlink.text}
              />
            ))}
          </Tabs>
        </Grid>
      </Grid>
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
              key={navlink.text}
              value={navlink.text.toLowerCase()}
              label={navlink.text}
              icon={navlink.icon}
            />
          ))}
        </BottomNavigation>
      </Box>
      */}
    </>
  );
};
export default NavBar;
