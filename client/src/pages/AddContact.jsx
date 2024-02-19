import React, { useState, useRef } from "react";
import classes from "./AddContact.module.css";
import AddContactModal from "../components/AddContactModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthToken, toastOptions } from "../utils/utility";
import { jwtDecode } from "jwt-decode";
import { addContactRoute, searchUserRoute } from "../api/userApi";

const AddContact = () => {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const inputRef = useRef();
  const token = getAuthToken();
  const decodedToken = jwtDecode(token);

  const addContactHandler = async (e) => {
    e.preventDefault();
    const currentUser = await addContactRoute(decodedToken._id, {
      contactId: user._id,
    });
    if (currentUser.data.status === "success") {
      toast.success("Contact added successfully", toastOptions);
      inputRef.current.value = "";
    } else if (currentUser.data.message === "Contact already added") {
      toast.error("Contact already added", toastOptions);
      inputRef.current.value = "";
    } else {
      toast.error("Error adding contact", toastOptions);
    }
    setModal(false);
  };

  const handleSubmit = async (e) => {
    const email = inputRef.current.value;
    e.preventDefault();
    if (email === "") {
      toast.error("Please enter a username", toastOptions);
      return;
    }
    
    setModal(true);
    setLoading(true);

    const responseUser = await searchUserRoute(email);
    setLoading(false);
    if (responseUser.data.status === "failed") {
      toast.error("User not found", toastOptions);
      return;
    }

    if (responseUser.data.user.length === 0) {
      toast.error("User not found", toastOptions);
      return;
    }

    if (responseUser.data.user._id === decodedToken._id) {
      toast.error("You cannot add yourself", toastOptions);
      inputRef.current.value = "";
      return;
    }

    setUser(responseUser.data.user);
  };

  const onClose = () => {
    setModal(false);
  };

  return (
    <>
      {modal && (
        <AddContactModal
          onClose={onClose}
          user={user}
          loading={loading}
          addContactHandler={addContactHandler}
        />
      )}
      <div className={classes["add-contact-container"]}>
        <div className={classes["title-container"]}>Add Contact</div>
        <div className={classes["input-container"]}>
          <input type="text" placeholder="Enter Email ID" ref={inputRef} />
          <button className={classes["submit-button"]} onClick={handleSubmit}>
            Search User
          </button>
        </div>
      </div>
    </>
  );
};

export default AddContact;
