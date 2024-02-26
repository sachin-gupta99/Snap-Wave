import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Contact from "./Contact";
import { userActions } from "../store/user";
import { toast } from "react-toastify";
import { getUserBasicRoute } from "../api/userApi";
import { removeAuthToken } from "../utils/utility";
import { router } from "../App";
import { toastOptions } from "../utils/utility";

const AllContacts = () => {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.user.contacts);
  const selectedIndex = useSelector((state) => state.user.selectedContactIndex);

  const handleContactClick = async (index) => {
    const currentChatSelected = await getUserBasicRoute(contacts[index]._id);

    if (currentChatSelected.data.status === "failed") {
      toast.error("Something went wrong. Please Sign in again", toastOptions);
      removeAuthToken();
      router.navigate("/auth?mode=login");
    } else dispatch(userActions.setCurrentChat(currentChatSelected.data.user));

    dispatch(userActions.setSelectedContactIndex(index));
  };

  return contacts.map((contact, index) => (
    <Contact
      key={contact._id}
      contact={contact}
      index={index}
      className={index === selectedIndex ? "selected" : ""}
      onClick={handleContactClick}
    />
  ));
};

export default AllContacts;
