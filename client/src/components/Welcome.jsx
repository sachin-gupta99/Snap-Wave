import React from "react";
import welcomeLogo from "../assets/welcome.gif";
import "./Welcome.css";

const Welcome = ({username}) => {
  return (
    <div className="welcome__container">
      <img src={welcomeLogo} alt="welcome" className="welcome__logo" />
      <h1 className="welcome__heading">Welcome {`${username}`}</h1>
      <h3 className="welcome__subheading">
        Please select a chat to Start messaging
      </h3>
    </div>
  );
};

export default Welcome;
