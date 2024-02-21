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
    if (e.key !== "Enter" && e.type !== "click") return;

    e.preventDefault();
    const email = inputRef.current.value;

    if (email === "") {
      toast.error("Please enter a username", toastOptions);
      return;
    }

    const loading = toast.loading("Searching user", toastOptions);

    const response = await searchUserRoute(email);

    if (response.data.status === "failed") {
      toast.update(loading, {
        ...toastOptions,
        render: "User not found",
        type: "error",
        isLoading: false,
      });
      return;
    } else if (response.data.user.length === 0) {
      toast.update(loading, {
        ...toastOptions,
        render: "User not found",
        type: "error",
        isLoading: false,
      });

      return;
    } else if (response.data.user._id === decodedToken._id) {
      toast.update(loading, {
        ...toastOptions,
        render: "You cannot add yourself",
        type: "error",
        isLoading: false,
      });

      return;
    } else {
      toast.dismiss(loading);
      setModal(true);
      setUser(response.data.user);
    }
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
          addContactHandler={addContactHandler}
        />
      )}
      <div className={classes["add-contact-container"]}>
        <div className={classes["title-container"]}>Add Contact</div>
        <div className={classes["input-container"]}>
          <input
            type="text"
            placeholder="Enter Email ID"
            ref={inputRef}
            onKeyDown={handleSubmit}
          />
          <button className={classes["submit-button"]} onClick={handleSubmit}>
            Search User
          </button>
        </div>
      </div>
    </>
  );
};

export default AddContact;
