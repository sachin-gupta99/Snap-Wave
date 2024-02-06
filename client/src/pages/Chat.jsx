import React, { useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import "./Chat.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getAllUsersRoute, getUserRoute } from "../utils/APIRoutes";
import { getAuthToken, removeAuthToken } from "../utils/auth";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import Contacts from "../components/Contacts";
import sampleAvatar from "../assets/sample-avatar.jpg";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
import { host } from "../utils/APIRoutes";

const override1 = {
  position: "absolute",
  top: "30%",
  left: "16%",
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
  const socket = useRef();
  const token = jwtDecode(getAuthToken());
  const currentUserId = token._id;
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
    setContactLoading(true);
    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          `${getAllUsersRoute}/${currentUserId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );
        if (response.data.status === "success") {
          setContacts(response.data.users);
          setContactLoading(false);
        }
      } catch (err) {
        navigate("/login");
        setContactLoading(false);
      }
    };
    fetchContacts();
  }, [navigate, currentUserId]);

  useEffect(() => {
    setUserDataLoading(true);
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${getUserRoute}/${user._id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });
        if (response.data.status === "success") {
          setUserData(response.data.user);
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

  useEffect(() => {
    if (userData) {
      socket.current = io(host);
      socket.current.emit("add-user", userData._id);
    }
  }, [userData]);

  return (
    <Container>
      <div className="container">
        {/* Chat List part */}
        <div className="chat-list">
          {/* Contacts part */}
          <div className="all-contacts">
            {contactLoading ? (
              <BeatLoader
                color="maroon"
                cssOverride={override1}
                size={15}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              contacts.map((contact, index) => (
                <Contacts
                  key={index}
                  contact={contact}
                  index={index}
                  className={index === selectedIndex ? "selected" : ""}
                  onClick={handleContactClick}
                />
              ))
            )}
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
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  overflow: scroll;
  .container {
    width: 85%;
    height: 85%;
    position: absolute;
    top: 50%;
    left: 50%;
    // margin: 0;
    padding: 1.25rem;
    transform: translate(-53%, -55%);
    display: grid;
    gap: 0.5rem;
    grid-template-columns: 25% 75%;
    align-items: start;
    background-color: #f5f5f5;
    box-shadow: 0px 0px 10px 0px #000000;
    border-radius: 0.4rem;
    @media screen and (min-width: 768px) and (max-width: 1024px) {
      grid-template-columns: 30% 70%;
    }
    @media screen and (min-width: 320px) and (max-width: 767px) {
      grid-template-columns: 100%;
    }
  }
`;

export default Chat;
