import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import PropTypes from "prop-types";

import Navbar from "../components/Navbar";
import classes from "./Home.module.css";
import { getAuthToken } from "../utils/utility";
import { host } from "../api/axiosInstance";
import { getUserRoute } from "../api/userApi";

const Home = ({ socket }) => {
  const token = jwtDecode(getAuthToken());
  const currentUserId = token._id;
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserRoute(currentUserId);
        setUserData(response.data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [currentUserId]);

  useEffect(() => {
    if (userData) {
      socket.current = io(host);
      socket.current.emit("add-user", userData._id);
    }
  }, [userData, socket]);

  return (
    <div className={classes.container}>
      <Navbar socket={socket} />
      <Outlet />
    </div>
  );
};

export default Home;

Home.propTypes = {
  socket: PropTypes.shape({
    current: PropTypes.shape({
      emit: PropTypes.func,
      on: PropTypes.func,
      disconnect: PropTypes.func,
    }),
  }),
};
