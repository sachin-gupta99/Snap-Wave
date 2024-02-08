import React from "react";
import welcomeLogo from "../assets/welcome.gif";
import classes from "./Welcome.module.css";

const Welcome = ({username}) => {
  return (
    <div className={classes["welcome__container"]}>
      <img src={welcomeLogo} alt="welcome" className={classes["welcome__logo"]} />
      <h1 className={classes["welcome__heading"]}>Welcome {`${username}`}</h1>
      <h3 className={classes["welcome__subheading"]}>
        Please select a chat to Start messaging
      </h3>
    </div>
  );
};

export default Welcome;
