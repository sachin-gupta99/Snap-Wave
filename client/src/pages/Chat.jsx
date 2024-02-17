import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

import { getUserRoute } from "../api/userApi";
import { getAuthToken, removeAuthToken } from "../utils/utility";
import BeatLoader from "react-spinners/BeatLoader";
import Contacts from "../components/Contacts";
import sampleAvatar from "../assets/sample-avatar.jpg";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
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

const Chat = ({ socket }) => {
  const user = useMemo(() => jwtDecode(getAuthToken()), []);
  const [contacts, setContacts] = useState([]);
  const [contactLoading, setContactLoading] = useState(true);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(undefined);
  const currentChat = contacts[selectedIndex];
  const navigate = useNavigate();

  const handleContactClick = (index) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    setUserDataLoading(true);
    const fetchUser = async () => {
      try {
        const response = await getUserRoute(user._id);
        if (response.data.status === "success") {
          setUserData(response.data.user);
          setContacts(response.data.user.contacts);
          setContactLoading(false);
        } else {
          removeAuthToken();
          navigate("/");
        }
        setUserDataLoading(false);
      } catch (err) {
        removeAuthToken();
        navigate("/");
        setUserDataLoading(false);
      }
    };
    fetchUser();
  }, [navigate, user]);

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
                return contacts.map((contact, index) => (
                  <Contacts
                    key={contact._id}
                    contact={contact}
                    index={index}
                    className={index === selectedIndex ? "selected" : ""}
                    onClick={handleContactClick}
                    socket={socket}
                  />
                ));
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
                  socket={socket}
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