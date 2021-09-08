import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import ReactDOM from "react-dom";
import { StateProvider, reducer } from "./state";
import App from "./App";
import theme from "./theme";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <StateProvider reducer={reducer}>
      <App />
    </StateProvider>
  </ThemeProvider>,
  document.querySelector("#root")
);
