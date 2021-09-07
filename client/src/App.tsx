import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Paper from "@material-ui/core/Paper";

import Loading from "./components/Loading";
import Home from "./pages/Home";

import "./App.css";

const App = () => {
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    user,
  } = useAuth0();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  });

  React.useEffect(() => {
    const getToken = async () => {
      if (!isAuthenticated) {
        return;
      }

      const token = await getAccessTokenSilently();

      console.log(token);
      console.log(user);
    };

    getToken();
  });

  return (
    <Paper className="app-container" elevation={10}>
      {!isAuthenticated ? <Loading /> : <Home />}
    </Paper>
  );
};

export default App;
