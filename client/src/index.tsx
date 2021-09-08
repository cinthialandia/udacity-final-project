import React from "react";
import ReactDOM from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import "./index.css";
import "./i18n";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const theme = createTheme({
  palette: {
    primary: {
      main: "#fca82e",
    },
    secondary: {
      main: "#e678a7",
    },
  },
  typography: {
    button: {
      color: "#fff",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-wvaee-nh.us.auth0.com"
      clientId="yRKmrm8XmrSPFlvT2bzM5sIzEnFzM5XR"
      redirectUri={window.location.origin}
      audience="https://dev-wvaee-nh.us.auth0.com/api/v2/"
      scope="read:current_user update:current_user_metadata"
    >
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
