import React, { useEffect } from "react";
import cx from "classnames";
import { CiLogout, CiEdit, CiSettings } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

import { uiActions } from "../store/ui";
import { userActions } from "../store/user";
import { getAuthToken, removeAuthToken, toastOptions, userAvatar } from "../utils/utility";
import { getUserRoute } from "../api/userApi";
import socket from "../socket";
import { router } from "../App";
import { logoutRoute } from "../api/authApi";
import classes from "./DropDownMenu.module.css";

const DropDownMenu = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.user);
  const dropdownOpen = useSelector((state) => state.ui.navbarDropdown);

  const token = getAuthToken();
  let currentUserId;

  if (token) {
    const decodedToken = jwtDecode(token);
    currentUserId = decodedToken._id;
  }

  const setOpen = () => {
    dispatch(uiActions.toggleNavbarDropdown());
  };

  const onLogout = async () => {
    const decodedToken = jwtDecode(getAuthToken());
    await logoutRoute(decodedToken._id);
    socket.current.disconnect();
    removeAuthToken();
    toast.success("Logged out successfully", toastOptions);
    router.navigate("/auth?mode=login");
    dispatch(uiActions.setNavbarDropdown(false));
    dispatch(userActions.setUserData(null));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserRoute(currentUserId);
        if (response.data.status === "failed") {
          removeAuthToken();
          router.navigate("/auth?mode=login");
        } else {
          dispatch(userActions.setUserData(response.data.user));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [currentUserId, dispatch]);

  useEffect(() => {
    if (userData) {
      socket.current.connect();
      socket.current.emit("add-user", userData._id);
    }
    return () => {
      socket.current.disconnect();
    };
  }, [userData]);

  return (
    <>
      <div className={classes["menu-trigger"]} onClick={() => setOpen()}>
        <img src={userAvatar(userData)} alt="avatar" />
      </div>

      <div
        className={cx(
          classes["dropdown-menu"],
          classes[`${dropdownOpen ? "active" : "inactive"}`]
        )}
      >
        <h3 className={classes["user-details__username"]}>
          {userData ? userData.username : "Username"}
          <br />
          <span className={classes["user-details__email"]}>
            {userData ? userData.email : "Username"}
          </span>
        </h3>
        <ul>
          <DropdownItem icon={CgProfile} text={"My Profile"} />
          <DropdownItem icon={CiEdit} text={"Edit Profile"} />
          <DropdownItem icon={CiSettings} text={"Settings"} />
          <DropdownItem icon={IoIosHelpCircleOutline} text={"Helps"} />
          <DropdownItem icon={CiLogout} text={"Logout"} onClick={onLogout} />
        </ul>
      </div>
    </>
  );
};

const DropdownItem = (props) => {
  return (
    <li className={classes["dropdownItem"]} onClick={props.onClick}>
      <props.icon />
      <span> {props.text} </span>
    </li>
  );
};

export default DropDownMenu;
