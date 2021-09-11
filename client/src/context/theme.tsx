import React from "react";
import {
  createTheme,
  ThemeProvider as MaterialThemeProvider,
} from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e678a7",
    },
    secondary: {
      main: "#fca82e",
    },
  },
  typography: {
    button: {
      color: "#fff",
    },
  },
});

export const ThemeProvider: React.FC = ({ children }) => (
  <MaterialThemeProvider theme={theme}>{children}</MaterialThemeProvider>
);
