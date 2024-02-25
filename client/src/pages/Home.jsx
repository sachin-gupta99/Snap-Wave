import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Navbar from "../components/Navbar";
import classes from "./Home.module.css";
import { getAuthToken, removeAuthToken } from "../utils/utility";
import { getUserRoute } from "../api/userApi";
import socket from "../socket";
import { router } from "../App";

const Home = () => {
  const token = getAuthToken();
  const decodedToken = jwtDecode(token);
  const currentUserId = decodedToken._id;

  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserRoute(currentUserId);
        if (response.data.status === "failed") {
          removeAuthToken();
          router.navigate("/auth?mode=login");
        } else {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [currentUserId]);

  useEffect(() => {
    if (userData) {
      socket.current.connect();
      socket.current.emit("add-user", userData._id);
    }

    return () => {
      if (socket.current.readyState === 1) {
        socket.current.disconnect();
      }
    };
  }, [userData]);

  return (
    <div className={classes.container}>
      <Navbar socket={socket} user={userData} />
      <Outlet />
    </div>
  );
};

export default Home;
