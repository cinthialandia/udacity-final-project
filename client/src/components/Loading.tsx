import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import "./Loading.css";

const Loading = () => (
  <div className="loading-container">
    <CircularProgress color="secondary" />
  </div>
);

export default Loading;
