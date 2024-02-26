import React, { useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import BeatLoader from "react-spinners/BeatLoader";

import { getUserRoute } from "../api/userApi";
import { getAuthToken, removeAuthToken } from "../utils/utility";
import sampleAvatar from "../assets/sample-avatar.jpg";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { router } from "../App";
import { userActions } from "../store/user";
import AllContacts from "../components/AllContacts";
import "./Chat.css";

const override1 = {
  position: "absolute",
  top: "50%",
  left: "23%",
  transform: "translate(-50%, -50%)",
  borderColor: "red",
};

const override2 = {
  position: "relative",
  transform: "rotate(90deg)",
  borderColor: "red",
};

const override3 = {
  position: "relative",
  left: "45%",
  borderColor: "red",
};

const Chat = () => {
  const dispatch = useDispatch();
  const user = useMemo(() => jwtDecode(getAuthToken()), []);
  const contacts = useSelector((state) => state.user.contacts);
  const contactLoading = useSelector((state) => state.user.contactsLoading);
  const userDataLoading = useSelector((state) => state.user.userDataLoading);
  const userData = useSelector((state) => state.user.user);
  const selectedIndex = useSelector((state) => state.user.selectedContactIndex);
  const currentChat = useSelector((state) => state.user.currentChat);

  useEffect(() => {
    dispatch(userActions.setUserDataLoading(true));
    const fetchUser = async () => {
      try {
        if (userData && contacts) {
          dispatch(userActions.setUserContactsLoading(false));
          dispatch(userActions.setUserDataLoading(false));
          dispatch(userActions.setUserContacts(userData.contacts));
          dispatch(userActions.setUserContactsLoading(false));
        } else {
          const response = await getUserRoute(user._id);
          if (response.data.status === "failed") {
            removeAuthToken();
            router.navigate("/auth?mode=login");
          } else {
            dispatch(userActions.setUserData(response.data.user));
            dispatch(userActions.setUserContactsLoading(false));
            dispatch(userActions.setUserContacts(response.data.user.contacts));
            dispatch(userActions.setUserDataLoading(false));
          }
        }
      } catch (err) {
        removeAuthToken();
        router.navigate("/auth?mode=login");
        dispatch(userActions.setUserDataLoading(false));
      }
    };
    fetchUser();

    return () => {
      dispatch(userActions.setSelectedContactIndex(undefined));
    };  
  }, [userData, contacts, user, dispatch]);

  return (
    <div className="chat-container-main">
      <div className="chat-subcontainer">
        {/* Chat List part */}
        <div className="chat-list">
          {/* Contacts part */}
          <div className="all-contacts">
            {(() => {
              if (contactLoading) {
                return (
                  <BeatLoader
                    color="maroon"
                    cssOverride={override1}
                    size={15}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                );
              } else if (contacts.length === 0) {
                return <div>No contacts found</div>;
              } else {
                return <AllContacts />;
              }
            })()}
          </div>

          {/* Self Details part */}
          <div className="self_details__container">
            {userDataLoading ? (
              <BeatLoader
                color="maroon"
                cssOverride={override2}
                size={10}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <>
                <div className="self_details__avatar">
                  <img
                    src={
                      userData.avatarImage
                        ? `data:image/svg+xml;base64,${userData.avatarImage}`
                        : sampleAvatar
                    }
                    alt="avatar"
                  />
                </div>
                <div className="self_details__username">
                  {userData.username || "Username"}
                </div>
                <div className="self_details__email">
                  {userData.email || "Email"}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chat Box part */}
        <div className="chat-box">
          {userDataLoading ? (
            <BeatLoader
              color="maroon"
              cssOverride={override3}
              size={15}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <>
              {selectedIndex === undefined ? (
                <Welcome username={userData.username} />
              ) : (
                <ChatContainer
                  currentChat={currentChat}
                  currentUser={userData}
                  // socket={socket}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;

Chat.propTypes = {
  socket: PropTypes.shape({
    current: PropTypes.shape({
      on: PropTypes.func.isRequired,
      emit: PropTypes.func.isRequired,
    }),
  }),
};
