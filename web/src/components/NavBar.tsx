import {
  AppBar,
  BottomNavigationAction,
  Box,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ShareIcon from "@material-ui/icons/Share";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import HomeIcon from "@material-ui/icons/Home";
import InsertChartIcon from "@material-ui/icons/InsertChart";
import ListAltIcon from "@material-ui/icons/ListAlt";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import { useNavigate } from "react-router-dom";
import { useStateValue } from "../state";
import { navBarBgColor } from "../theme";

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
    text: "Values",
  },
];

interface NavBarProps {
  setPage: any;
  page: string;
}

const NavBar: React.FC<NavBarProps> = ({ page, setPage }) => {
  const [{ leagueData, selectedGw, gwsData }, dispatch] = useStateValue();
  if (!leagueData?.league_curr.managers) return null;
  const latestGw: boolean = gwsData[0].id.toString() == selectedGw;
  const navigate = useNavigate();
  return (
    <>
      <AppBar position="fixed">
        <Toolbar style={{ background: navBarBgColor }}>
          <img
            onClick={() => {
              dispatch({ type: "RESET_LEAGUE_DATA", payload: null });
              navigate("/");
            }}
            src="/images/logo192.png"
            alt="logo"
            style={{
              maxHeight: "75%",
              maxWidth: 80,
              paddingBlock: 7,
              cursor: "pointer",
            }}
          />
          <Box display={{ xs: "none", md: "flex" }}>
            <Tabs
              style={{ marginLeft: 15 }}
              value={page}
              onChange={(_event, newValue) => {
                setPage(newValue);
                window.scroll({ top: 0 });
              }}
            >
              {navLinks.map((navlink) => (
                <Tab
                  key={navlink.text}
                  value={navlink.text.toLowerCase()}
                  icon={navlink.icon}
                  label={navlink.text}
                  disabled={navlink.text == "Standings" && !latestGw}
                />
              ))}
            </Tabs>
          </Box>
          <Typography style={{ marginLeft: "auto" }} variant="h5">
            {`${leagueData?.league_curr.league.name}${leagueData?.league_curr.managers.length > 49 ? " (Top 50)" : ""
              }, Gameweek ${selectedGw} `}
          </Typography>
          <ShareIcon
            style={{
              paddingLeft: "auto",
              marginLeft: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              navigator.clipboard.writeText(
                `https://fplbasket.com/id/${leagueData.league_curr.league.id}`,
              );
              window.alert("Link to league copied to clipboard");
            }}
          />
        </Toolbar>
      </AppBar>
      <Box display={{ md: "none" }}>
        <BottomNavigation
          style={{
            zIndex: 999999999,
            background: navBarBgColor,
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
          }}
          value={page}
          onChange={(_event, newValue) => {
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
    </>
  );
};
export default NavBar;
