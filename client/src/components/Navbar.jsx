import React, { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";

import logo from "../assets/logo.png";
import DropDownMenu from "./DropDownMenu";
import { uiActions } from "../store/ui";
import classes from "./Navbar.module.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        dispatch(uiActions.setNavbarDropdown(false));
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
          <DropDownMenu />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
