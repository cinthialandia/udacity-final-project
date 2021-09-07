import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import "./Loading.css";

const Loading = () => (
  <div className="loading-container">
    <CircularProgress />
  </div>
);

export default Loading;
