import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AddContactModal from "../components/AddContactModal";
import { getAuthToken, toastOptions } from "../utils/utility";
import { addContactRoute, searchUserRoute } from "../api/userApi";
import { uiActions } from "../store/ui";
import { userActions } from "../store/user";
import classes from "./AddContact.module.css";

const AddContact = () => {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.ui.contactModal);
  const inputRef = useRef();
  const token = getAuthToken();
  const decodedToken = jwtDecode(token);

  const addContactHandler = async (userId) => {
    const currentUser = await addContactRoute(decodedToken._id, {
      contactId: userId,
    });
    if (currentUser.data.status === "success") {
      toast.success("Contact added successfully", toastOptions);
      dispatch(userActions.addUserContacts(currentUser.data.user));
      inputRef.current.value = "";
    } else if (currentUser.data.message === "Contact already added") {
      toast.error("Contact already added", toastOptions);
      inputRef.current.value = "";
    } else {
      toast.error("Error adding contact", toastOptions);
    }
    dispatch(uiActions.setContactModal(false));
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
    dispatch(userActions.setContactSearchLoading(true));

    const response = await searchUserRoute(email);

    dispatch(userActions.setContactSearchLoading(false));

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
      dispatch(uiActions.setContactModal(true));
      dispatch(userActions.setSearchContact(response.data.user));
    }
  };

  const onClose = () => {
    dispatch(uiActions.setContactModal(false));
  };

  return (
    <>
      {modal && (
        <AddContactModal
          onClose={onClose}
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
