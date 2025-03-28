import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
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
