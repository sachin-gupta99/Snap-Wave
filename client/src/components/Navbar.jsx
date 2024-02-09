import React from "react";
import classes from "./Navbar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { removeAuthToken } from "../utils/utility";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const logout = () => {
    removeAuthToken();
    navigate("/login");
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
