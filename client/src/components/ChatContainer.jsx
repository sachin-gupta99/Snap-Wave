import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import cx from "classnames";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import BeatLoader from "react-spinners/BeatLoader";
import "react-toastify/dist/ReactToastify.css";

import sampleAvatar from "../assets/sample-avatar.jpg";
import ChatInput from "./ChatInput";
import { getMessagesRoute, sendMessageRoute } from "../api/messageApi";
import { toastOptions } from "../utils/utility";
import classes from "./ChatContainer.module.css";
import { messagesActions } from "../store/messages";
import socket from "../socket";

const ChatContainer = ({ currentUser }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages.messages);
  const loading = useSelector((state) => state.messages.messagesLoading);
  const arrivalMessage = useSelector((state) => state.messages.arrivalMessage);
  const userOnline = useSelector((state) => state.user.userOnline);
  const userOffline = useSelector((state) => state.user.userOffline);
  const currentChat = useSelector((state) => state.user.currentChat);

  const [status, setStatus] = useState("offline");

  useEffect(() => {
    if (userOffline.includes(currentChat._id) && !userOnline.includes(currentChat._id)) {
      console.log("1st case");
      setStatus("offline");
    } else if (userOnline.includes(currentChat._id) && !userOffline.includes(currentChat._id)) {
      console.log("2nd case");
      setStatus("online");
    } else if (currentChat.isOnline) {
      console.log("3rd case");
      setStatus("online");
    } else if (!currentChat.isOnline) {
      console.log("4th case");
      setStatus("offline");
    }
  }, [userOnline, userOffline, currentChat]);

  const scrollRef = useRef();
  useEffect(() => {
    dispatch(messagesActions.setMessagesLoading(true));
    const fetchMessages = async () => {
      if (currentChat) {
        const response = await getMessagesRoute({
          from: currentUser._id,
          to: currentChat._id,
        });

        if (response.data.status === "success")
          dispatch(messagesActions.setMessages(response.data.messages));
        else {
          toast.error(
            "Error fetching messages. Please logout and sign in again",
            toastOptions
          );
        }
      }
      dispatch(messagesActions.setMessagesLoading(false));
    };
    fetchMessages();
  }, [currentChat, currentUser, dispatch]);

  const handleSendMsg = async (msg) => {
    const currentSocket = socket.current;
    const sendingMsg = await sendMessageRoute({
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });

    if (sendingMsg.data.status === "success") {
      currentSocket.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        message: msg,
      });
      dispatch(messagesActions.addMessage({ fromSelf: true, message: msg }));
    } else {
      toast.error(
        "Error sending message. Please logout and sign in again",
        toastOptions
      );
    }
  };

  useEffect(() => {
    const currentSocket = socket.current;
    if (currentSocket) {
      currentSocket.on("receive-msg", (msg, receiver) => {
        dispatch(
          messagesActions.setArrivalMessage({
            fromSelf: false,
            message: msg,
            receiver: receiver,
          })
        );
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (arrivalMessage && currentChat._id === arrivalMessage.receiver) {
      dispatch(messagesActions.addMessage(arrivalMessage));
    }
  }, [arrivalMessage, currentChat._id, dispatch]);

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
              classes[`${status === "online" ? "online-status" : ""}`]
            )}
          >
            {status === "online" ? "Online" : ""}
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
  currentUser: PropTypes.shape({
    _id: PropTypes.string,
    avatarImage: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
};
