import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import classes from "./Home.module.css";
import { getAuthToken } from "../utils/utility";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import { host } from "../utils/APIRoutes";
import axios from "axios";
import { getUserRoute } from "../utils/APIRoutes";
import { useState } from "react";

const Home = ({ socket }) => {
  const token = jwtDecode(getAuthToken());
  const currentUserId = token._id;
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${getUserRoute}/${currentUserId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        setUserData(response.data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [currentUserId]);

  useEffect(() => {
    if (userData) {
      console.log(userData._id);
      socket.current = io(host);
      socket.current.emit("add-user", userData._id);
    }
  }, [userData, socket]);

  // useEffect(() => {
  //   socket.current = io(host, {
  //     query: {
  //       userId: currentUserId,
  //     },
  //   });
  //   return () => {
  //     socket.current.disconnect();
  //   };
  // }, [currentUserId, socket]);

  return (
    <div className={classes.container}>
      <Navbar socket={socket} />
      <Outlet />
    </div>
  );
};

export default Home;
