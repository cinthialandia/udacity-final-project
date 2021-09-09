import React from "react";
import Paper from "@material-ui/core/Paper";

import { useAppSelector } from "./store";
import Loading from "./components/Loading";
import Home from "./pages/Home";

import "./App.css";

const App = () => {
  const { isLoading } = useAppSelector((state) => state.user);

  return (
    <Paper className="app-container" elevation={10}>
      {isLoading ? <Loading /> : <Home />}
    </Paper>
  );
};

export default App;
