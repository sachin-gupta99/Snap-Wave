import React from "react";
import classes from "./AddContactModal.module.css";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import BeatLoader from "react-spinners/BeatLoader";
import { useSelector } from "react-redux";
import sampleAvatar from "../assets/sample-avatar.jpg";

const override = {
  justifyContent: "center",
};

const Backdrop = ({ onClose }) => {
  return <div className={classes["modal-backdrop"]} onClick={onClose}></div>;
};

const Modal = ({ onClose, addContactHandler }) => {
  const loading = useSelector((state) => state.user.contactSearchLoading);
  const contact = useSelector((state) => state.user.searchedContact);

  return (
    <div className={classes["modal"]}>
      {loading ? (
        <BeatLoader
          color="maroon"
          cssOverride={override}
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <div className={classes["user-container"]}>
          <div className={classes.avatar}>
            <img
              src={
                contact
                  ? `data:image/svg+xml;base64,${contact.avatarImage}`
                  : sampleAvatar
              }
              alt="user-avatar"
            />
          </div>
          <span className={classes["user-username"]}>
            {contact ? contact.username : "Username"}
          </span>
          <span className={classes["user-email"]}>
            {contact ? contact.email : "Email"}
          </span>
        </div>
      )}

      <div className={classes["action-buttons"]}>
        <button className={classes["cancel-button"]} onClick={onClose}>
          Cancel
        </button>
        <button
          className={classes["submit-button"]}
          onClick={() => addContactHandler(contact._id)}
        >
          Add user
        </button>
      </div>
    </div>
  );
};

const portalElement = document.getElementById("overlay");

const AddContactModal = ({ onClose, addContactHandler }) => {
  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClose={onClose} />, portalElement)}
      {ReactDOM.createPortal(
        <Modal onClose={onClose} addContactHandler={addContactHandler} />,
        portalElement
      )}
    </>
  );
};

export default AddContactModal;

AddContactModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  addContactHandler: PropTypes.func.isRequired,
};

Backdrop.propTypes = {
  onClose: PropTypes.func.isRequired,
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  addContactHandler: PropTypes.func.isRequired,
};
