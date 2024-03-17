import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import classes from "./LayoutContainer.module.css";

const LayoutContainer = () => {
  return (
    <div className={classes.container}>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default LayoutContainer;
