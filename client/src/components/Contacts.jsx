import React, { useEffect } from "react";
import sampleAvatar from "../assets/sample-avatar.jpg";
import classes from "./Contacts.module.css";
import cx from "classnames";
import PropTypes from "prop-types";

const Contacts = ({
  index,
  contact,
  onClick,
  userOnline,
  className,
  socket,
}) => {
  console.log(userOnline);
  const handleClick = () => {
    onClick(index);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleClick();
    }
  };

  useEffect(() => {
    if (userOnline.includes(contact._id)) {
      console.log(contact._id);
      const status = document.getElementById(contact._id);
      if (status) {
        status.classList.remove(classes["offline-status"]);
        status.classList.add(classes["online-status"]);
      }
    } else {
      if (!contact.isOnline) {
        const status = document.getElementById(contact._id);
        if (status) {
          status.classList.remove(classes["online-status"]);
          status.classList.add(classes["offline-status"]);
        }
      }
    }
  }, [contact, userOnline]);
  //   socket.current.on("user-online", (userId) => {
  //     if (contact._id === userId) {
  //       const status = document.getElementById(contact._id);
  //       if (status) {
  //         status.classList.remove(classes["offline-status"]);
  //         status.classList.add(classes["online-status"]);
  //       }
  //     }
  //   });

  //   socket.current.on("user-offline", (userId) => {
  //     if (contact._id === userId) {
  //       const status = document.getElementById(contact._id);
  //       if (status) {
  //         status.classList.remove(classes["online-status"]);
  //         status.classList.add(classes["offline-status"]);
  //       }
  //     }
  //   });
  // }, [contact, socket]);

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
