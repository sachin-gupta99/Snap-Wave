import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import cx from "classnames";
import PropTypes from "prop-types";

import sampleAvatar from "../assets/sample-avatar.jpg";
import ChatInput from "./ChatInput";
import { getMessagesRoute, sendMessageRoute } from "../api/messageApi";
import { toastOptions } from "../utils/utility";
import classes from "./ChatContainer.module.css";
import "react-toastify/dist/ReactToastify.css";
import BeatLoader from "react-spinners/BeatLoader";

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  useEffect(() => {
    setLoading(true);
    const fetchMessages = async () => {
      if (currentChat) {
        const response = await getMessagesRoute({
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data.messages);
      }
      setLoading(false);
    };
    fetchMessages();
  }, [currentChat, currentUser]);

  const handleSendMsg = async (msg) => {
    const sendingMsg = await sendMessageRoute({
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });

    if (sendingMsg.data.status === "success") {
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        message: msg,
      });

      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);
    } else {
      toast.error(
        "Error sending message. Please logout and sign in again",
        toastOptions
      );
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("receive-msg", (msg, receiver) => {
        setArrivalMessage({
          fromSelf: false,
          message: msg,
          receiver: receiver,
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage && currentChat._id === arrivalMessage.receiver) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={classes["chat-container"]}>
      <div className={classes["chat-header"]}>
        <div className={classes["chat-avatar"]}>
          <img
            src={
              currentChat.avatarImage
                ? `data:image/svg+xml;base64,${currentChat.avatarImage}`
                : sampleAvatar
            }
            alt="avatar"
          />
        </div>
        <div className={classes["chat-user-details"]}>
          <div className={classes["chat-username"]}>{currentChat.username}</div>
          <div
            className={cx(
              classes["chat-status"],
              classes[`${currentChat.isOnline ? "online-status" : ""}`]
            )}
          >
            {currentChat.isOnline ? "Online" : ""}
          </div>
        </div>
      </div>
      <div className={classes["chat-messages"]}>
        <div className={classes["message-container"]}>
          {loading ? (
            <div className={classes["loading"]}>
              <BeatLoader
                color="maroon"
                size={15}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <span>Loading your messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className={classes["no-messages"]}>No messages</div>
          ) : (
            messages.map((msg) => (
              <div key={uuidv4()} className={classes.message} ref={scrollRef}>
                <div
                  className={cx(
                    classes["message-content"],
                    classes[`${msg.fromSelf ? "sent" : "receive"}`]
                  )}
                >
                  {msg.message}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className={classes["chat-input"]}>
        <ChatInput onSend={handleSendMsg} />
      </div>
    </div>
  );
};

export default ChatContainer;

ChatContainer.propTypes = {
  currentChat: PropTypes.shape({
    _id: PropTypes.string,
    avatarImage: PropTypes.string,
    username: PropTypes.string,
    isOnline: PropTypes.bool,
  }).isRequired,
  currentUser: PropTypes.shape({
    _id: PropTypes.string,
    avatarImage: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,

  socket: PropTypes.shape({
    current: PropTypes.shape({
      emit: PropTypes.func,
      on: PropTypes.func,
    }),
  }).isRequired,
};
