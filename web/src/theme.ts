import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// A custom theme for this app
export const navBarBgColor = "#13181F";
const theme = createTheme({
  palette: {
    // type: "dark",
    mode: "dark",
    background: {
      default: "#171c24",
      paper: "#222b36",
    },
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
