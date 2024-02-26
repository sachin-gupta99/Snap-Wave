import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Contact from "./Contact";
import { userActions } from "../store/user";
import { toast } from "react-toastify";
import { getUserBasicRoute } from "../api/userApi";
import { removeAuthToken } from "../utils/utility";
import { router } from "../App";
import { toastOptions } from "../utils/utility";
import { BeatLoader } from "react-spinners";
import { getContactsRoute } from "../api/userApi";

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
    const currentChatSelected = await getUserBasicRoute(contacts[index]._id);

    if (currentChatSelected.data.status === "failed") {
      toast.error("Something went wrong. Please Sign in again", toastOptions);
      removeAuthToken();
      router.navigate("/auth?mode=login");
    } else dispatch(userActions.setCurrentChat(currentChatSelected.data.user));

    dispatch(userActions.setSelectedContactIndex(index));
  };

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
  ) : contacts.length === 0 ? (
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
};

export default AllContacts;
