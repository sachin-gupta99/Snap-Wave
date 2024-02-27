import React, { useEffect } from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import sampleAvatar from "../assets/sample-avatar.jpg";
import classes from "./Contacts.module.css";

const Contacts = ({ index, contact, onClick, className }) => {
  const userOnline = useSelector((state) => state.user.userOnline);
  const userOffline = useSelector((state) => state.user.userOffline);
  const handleClick = () => {
    onClick(index);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleClick();
    }
  };

  useEffect(() => {
    if (
      userOnline.includes(contact._id) &&
      !userOffline.includes(contact._id)
    ) {
      const status = document.getElementById(contact._id);

      if (status.classList.contains(classes["offline-status"])) {
        status.classList.remove(classes["offline-status"]);
        status.classList.add(classes["online-status"]);
      }
    } else if (
      userOffline.includes(contact._id) &&
      !userOnline.includes(contact._id)
    ) {
      const status = document.getElementById(contact._id);

      if (status.classList.contains(classes["online-status"])) {
        status.classList.remove(classes["online-status"]);
        status.classList.add(classes["offline-status"]);
      }
    }
  }, [contact, userOnline, userOffline]);

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cx(classes["contact-container"], classes[`${className}`])}
      tabIndex={0} // to make the div focusable
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
        <p
          id={contact._id}
          className={cx(
            classes["contact__status"],
            classes[`${contact.isOnline ? "online-status" : "offline-status"}`]
          )}
        ></p>
      </div>
    </button>
  );
};

export default Contacts;

Contacts.propTypes = {
  index: PropTypes.number.isRequired,
  contact: PropTypes.shape({
    _id: PropTypes.string,
    avatarImage: PropTypes.string,
    username: PropTypes.string,
    isOnline: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  socket: PropTypes.shape({
    current: PropTypes.shape({
      on: PropTypes.func,
    }),
  }),
};
