import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

import Contact from "./Contact";
import { userActions } from "../store/user";
import { getUserBasicRoute, getContactsRoute } from "../api/userApi";
import { removeAuthToken, toastOptions } from "../utils/utility";
import { router } from "../App";

const override = {
  position: "absolute",
  top: "50%",
  left: "23%",
  transform: "translate(-50%, -50%)",
  borderColor: "red",
};

const AllContacts = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.user);
  const contacts = useSelector((state) => state.user.contacts);
  const selectedIndex = useSelector((state) => state.user.selectedContactIndex);
  const contactLoading = useSelector((state) => state.user.contactsLoading);

  useEffect(() => {
    const fetchContacts = async () => {
      if (userData) {
        const response = await getContactsRoute(userData._id);
        if (response.data.status === "failed") {
          removeAuthToken();
          router.navigate("/auth?mode=login");
        } else {
          dispatch(userActions.setUserContacts(response.data.contacts));
        }
        dispatch(userActions.setUserContactsLoading(false));
      }
    };
    fetchContacts();

    return () => {
      dispatch(userActions.setSelectedContactIndex(undefined));
    };
  }, [userData, dispatch]);

  const handleContactClick = async (index) => {
    if (index === selectedIndex) return;
    const currentChatSelected = await getUserBasicRoute(contacts[index]._id);

    if (currentChatSelected.data.status === "failed") {
      toast.error("Something went wrong. Please Sign in again", toastOptions);
      removeAuthToken();
      router.navigate("/auth?mode=login");
    } else dispatch(userActions.setCurrentChat(currentChatSelected.data.user));

    dispatch(userActions.setSelectedContactIndex(index));
  };

  const contactsData =
    contacts.length === 0 ? (
      <div>No contacts found</div>
    ) : (
      contacts.map((contact, index) => (
        <Contact
          key={contact._id}
          contact={contact}
          index={index}
          className={index === selectedIndex ? "selected" : ""}
          onClick={handleContactClick}
        />
      ))
    );

  return contactLoading ? (
    <div className="loader">
      <BeatLoader
        color="maroon"
        cssOverride={override}
        size={15}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  ) : (
    contactsData
  );
};

export default AllContacts;
