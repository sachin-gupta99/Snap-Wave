import React from "react";
import classes from "./Navbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuthToken, removeAuthToken } from "../utils/utility";
import logo from "../assets/logo.png";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../utils/utility";
import { logoutRoute } from "../utils/APIRoutes";

const Navbar = ({socket}) => {
  const navigate = useNavigate();
  const logout = async () => {
    const token = getAuthToken();
    const decodedToken = jwtDecode(token);
    removeAuthToken();
    await axios.get(`${logoutRoute}/${decodedToken._id}`, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    socket.current.disconnect();
    toast.success("Logged out successfully", toastOptions);
    navigate("/auth?mode=login");
  };

  return (
    <div className={classes["navbar"]}>
      <div className={classes["navbar-brand"]}>
        <NavLink to="/">
          <img src={logo} alt="logo" />
          <span>Snap-Wave</span>
        </NavLink>
      </div>
      <ul id="nav-mobile" className={classes["navbar-menu"]}>
        <li>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Chat
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/add-contact"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Add Contact
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/setAvatar"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Set Avatar
          </NavLink>
        </li>
        <li>
          <NavLink onClick={logout}>Logout</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
