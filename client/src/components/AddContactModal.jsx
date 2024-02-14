import React from "react";
import classes from "./AddContactModal.module.css";
import ReactDOM from "react-dom";

const Backdrop = ({ onClose }) => {
  return <div className={classes["modal-backdrop"]} onClick={onClose}></div>;
};

const Modal = ({ onClose, user }) => {
  console.log(user);
  return (
    <div className={classes["modal"]}>
      <div className={classes["user-container"]} key={user._id}>
        <div className={classes.avatar}>
          <img
            src={`data:image/svg+xml;base64,${user.avatarImage}`}
            alt="user-avatar"
          />
        </div>
        <span className={classes["user-username"]}>{user.username}</span>
        <span className={classes["user-email"]}>{user.email}</span>
      </div>
      <div className={classes["action-buttons"]}>
        <button className={classes["cancel-button"]} onClick={onClose}>
          Cancel
        </button>
        <button className={classes["submit-button"]}>Add user</button>
      </div>
    </div>
  );
};

const portalElement = document.getElementById("overlay");

const AddContactModal = ({ onClose, user }) => {
  //   console.log(user);
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClose={onClose} />, portalElement)}
      {ReactDOM.createPortal(
        <Modal onClose={onClose} user={user} />,
        portalElement
      )}
    </>
  );
};

export default AddContactModal;
