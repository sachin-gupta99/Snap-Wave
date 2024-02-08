import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import classes from './Home.module.css';

const Home = () => {
  return (
    <div className={classes.container}>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Home;
