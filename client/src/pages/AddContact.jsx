import React, { useState, useRef } from "react";
import "./AddContact.css";
import AddContactModal from "../components/AddContactModal";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthToken, toastOptions } from "../utils/utility";
import { jwtDecode } from "jwt-decode";

const AddContact = () => {
  const [modal, setModal] = useState(false);
  const [user, setUser] = useState(null);
  const inputRef = useRef();
  const token = getAuthToken();
  const decodedToken = jwtDecode(token);

  const addContactHandler = async (e) => {
    e.preventDefault();
    const currentUser = await axios.post(
      `http://localhost:5000/api/user/add-contact/${decodedToken._id}`,
      {
        userId: decodedToken._id,
        contactId: user._id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
    if (currentUser.data.status === "success") {
      toast.success("Contact added successfully", toastOptions);
    } else {
      if (currentUser.data.message === "Contact already added") {
        toast.error("Contact already added", toastOptions);
        inputRef.current.value = "";
      } else {
        toast.error("Error adding contact", toastOptions);
      }
    }
    setModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = inputRef.current.value;
    const responseUser = await axios.get(
      `http://localhost:5000/api/user/email/${email}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );
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
    setModal(true);
  };

  const onClick = () => {
    setModal(false);
  };

  const onClose = () => {
    setModal(false);
  };

  return (
    <>
      {modal && (
        <AddContactModal
          onClick={onClick}
          setModal={setModal}
          onClose={onClose}
          user={user}
          addContactHandler={addContactHandler}
        />
      )}
      <div className="add-contact-container">
        <div className="title-container">Add Contact</div>
        <div className="input-container">
          <input type="text" placeholder="Enter Username" ref={inputRef} />
          <button className="submit-button" onClick={handleSubmit}>
            Search User
          </button>
        </div>
      </div>
    </>
  );
};

export default AddContact;
