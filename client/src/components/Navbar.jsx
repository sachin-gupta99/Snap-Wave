import React, { useRef, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

import { getAuthToken, removeAuthToken, toastOptions } from "../utils/utility";
import { logoutRoute } from "../api/authApi";
import logo from "../assets/logo.png";
import "react-toastify/dist/ReactToastify.css";
import classes from "./Navbar.module.css";
import DropDownMenu from "./DropDownMenu";

const Navbar = ({ socket, user }) => {
  const menuRef = useRef();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const onLogout = async () => {
    const token = getAuthToken();
    const decodedToken = jwtDecode(token);
    removeAuthToken();
    await logoutRoute(decodedToken._id);
    socket.current.disconnect();
    toast.success("Logged out successfully", toastOptions);
    navigate("/auth?mode=login");
  };

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div className={classes["navbar"]}>
      <div className={classes["navbar-brand"]}>
        <NavLink to="/">
          <img src={logo} alt="logo" />
          <span>Snap-Wave</span>
        </NavLink>
      </div>
      <div className={classes["navbar-options"]}>
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
        </ul>
        <div className={classes["menu-container"]} ref={menuRef}>
          <DropDownMenu
            user={user}
            setOpen={setOpen}
            open={open}
            onLogout={onLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

Navbar.propTypes = {
  socket: PropTypes.shape({
    current: PropTypes.shape({
      disconnect: PropTypes.func.isRequired,
    }),
  }),
};
