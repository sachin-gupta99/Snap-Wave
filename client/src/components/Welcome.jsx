import React from "react";
import { useSelector } from "react-redux";

import welcomeLogo from "../assets/welcome.gif";
import classes from "./Welcome.module.css";

const Welcome = () => {
  const userData = useSelector((state) => state.user.user);

  return (
    <div className={classes["welcome__container"]}>
      <img
        src={welcomeLogo}
        alt="welcome"
        className={classes["welcome__logo"]}
      />
      <h1 className={classes["welcome__heading"]}>
        Welcome {`${userData ? userData.username : "Username"}`}
      </h1>
      <h3 className={classes["welcome__subheading"]}>
        Please select a chat to Start messaging
      </h3>
    </div>
  );
};

export default Welcome;