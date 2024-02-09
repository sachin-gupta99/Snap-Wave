import React from "react";
import sampleAvatar from "../assets/sample-avatar.jpg";
import classes from "./Contacts.module.css";
import cx from "classnames";
import PropTypes from "prop-types";

const Contacts = ({ index, contact, onClick, className }) => {
  const handleClick = () => {
    onClick(index);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleClick();
    }
  };

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
        <p className={classes["contact__status"]}></p>
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
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};