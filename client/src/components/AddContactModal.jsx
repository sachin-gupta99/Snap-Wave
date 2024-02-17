import React from "react";
import classes from "./AddContactModal.module.css";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const Backdrop = ({ onClose }) => {
  return <div className={classes["modal-backdrop"]} onClick={onClose}></div>;
};

const Modal = ({ onClose, user, addContactHandler }) => {
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
        <button
          className={classes["submit-button"]}
          onClick={addContactHandler}
        >
          Add user
        </button>
      </div>
    </div>
  );
};

const portalElement = document.getElementById("overlay");

const AddContactModal = ({ onClose, user, addContactHandler }) => {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClose={onClose} />, portalElement)}
      {ReactDOM.createPortal(
        <Modal
          onClose={onClose}
          user={user}
          addContactHandler={addContactHandler}
        />,
        portalElement
      )}
    </>
  );
};

export default AddContactModal;

AddContactModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    avatarImage: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  addContactHandler: PropTypes.func.isRequired,
};

Backdrop.propTypes = {
  onClose: PropTypes.func.isRequired,
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  addContactHandler: PropTypes.func.isRequired,
};
