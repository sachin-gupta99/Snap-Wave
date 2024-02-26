import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import classes from "./Home.module.css";

const Home = () => {
  return (
    <div className={classes.container}>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Home;
