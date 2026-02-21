import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { createRoot } from "react-dom/client";
import { StateProvider, reducer } from "./state";
import App from "./App";
import theme from "./theme";

const container = document.querySelector("#root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <StateProvider reducer={reducer}>
      <App />
    </StateProvider>
  </ThemeProvider>
);
