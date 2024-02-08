import React from "react";
import sampleAvatar from "../assets/sample-avatar.jpg";
import classes from "./Contacts.module.css";
import cx from "classnames";

const Contacts = ({ index, contact, onClick, className }) => {
  const handleClick = () => {
    onClick(index);
  };
  return (
    <div
      onClick={() => handleClick()}
      className={cx(classes["contact-container"], classes[`${className}`])}
    >
      <img
        src={
          contact.avatarImage
            ? `data:image/svg+xml;base64,${contact.avatarImage}`
            : sampleAvatar
        }
        alt="avatar"
        className={classes.avatar}
      />
      <div className={classes["contact__details"]}>
        <h3 className={classes["contact__username"]}>{contact.username}</h3>
        <p className={classes["contact__status"]}></p>
      </div>
    </div>
  );
};

export default Contacts;
