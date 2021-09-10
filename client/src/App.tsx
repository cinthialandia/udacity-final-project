import React, { useEffect } from "react";
import Paper from "@material-ui/core/Paper";

import { useAppSelector, useAppDispatch } from "./store";
import Loading from "./components/Loading";
import Home from "./pages/Home";

import "./App.css";

const App = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch({ type: "USER_ATTEMPT_LOGIN" });
  }, [dispatch]);

  return (
    <Paper className="app-container" elevation={10}>
      {isLoading ? <Loading /> : <Home />}
    </Paper>
  );
};

export default App;
