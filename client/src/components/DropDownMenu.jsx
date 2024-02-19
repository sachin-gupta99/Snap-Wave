import React from "react";
import classes from "./DropDownMenu.module.css";
import cx from "classnames";
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";

const DropDownMenu = ({ user, setOpen, open, onLogout }) => {
  return (
    <>
      <div
        className={classes["menu-trigger"]}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        <img
          src={
            user.avatarImage
              ? `data:image/svg+xml;base64,${user.avatarImage}`
              : "https://www.gravatar.com/avatar/000?d=mp"
          }
          alt="avatar"
        />
      </div>

      <div
        className={cx(
          classes["dropdown-menu"],
          classes[`${open ? "active" : "inactive"}`]
        )}
      >
        <h3 className={classes["user-details__username"]}>
          {user.username}
          <br />
          <span className={classes["user-details__email"]}>{user.email}</span>
        </h3>
        <ul>
          <DropdownItem icon={CgProfile} text={"My Profile"} />
          <DropdownItem icon={CiEdit} text={"Edit Profile"} />
          <DropdownItem icon={CiSettings} text={"Settings"} />
          <DropdownItem icon={IoIosHelpCircleOutline} text={"Helps"} />
          <DropdownItem icon={CiLogout} text={"Logout"} onClick={onLogout}/>
        </ul>
      </div>
    </>
  );
};

function DropdownItem(props) {
  return (
    <li className={classes["dropdownItem"]} onClick={props.onClick}>
      <props.icon />
      <a> {props.text} </a>
    </li>
  );
}

export default DropDownMenu;
