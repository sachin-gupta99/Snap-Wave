import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import sampleAvatar from "../assets/sample-avatar.jpg";
import ChatInput from "./ChatInput";
import { getMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";
import { getAuthToken } from "../utils/utility";
import classes from "./ChatContainer.module.css";
import cx from "classnames";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../utils/utility";

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat) {
        const response = await axios.post(
          getMessagesRoute,
          { from: currentUser._id, to: currentChat._id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );
        setMessages(response.data.messages);
      }
    };
    fetchMessages();
  }, [currentChat, currentUser]);

  const handleSendMsg = async (msg) => {
    const sendingMsg = await axios.post(
      sendMessageRoute,
      {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

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
      toast.error("Error sending message. Please logout and sign in again", toastOptions);
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("receive-msg", (msg) => {
        setArrivalMessage({
          fromSelf: false,
          message: msg,
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

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
          <div className={classes["chat-status"]} style={{ color: "green" }}>
            Online
          </div>
        </div>
      </div>
      <div className={classes["chat-messages"]}>
        <div className={classes["message-container"]}>
          {messages.length === 0 ? (
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
