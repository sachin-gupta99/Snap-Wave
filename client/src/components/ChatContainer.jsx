import React, { useState, useEffect, useRef } from "react";
import sampleAvatar from "../assets/sample-avatar.jpg";
import "./ChatContainer.css";
import ChatInput from "./ChatInput";
import axios from "axios";
import { getMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";
import { getAuthToken } from "../utils/auth";
import {v4 as uuidv4} from "uuid";

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
    await axios.post(
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
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
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
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-avatar">
          <img
            src={
              currentChat.avatarImage
                ? `data:image/svg+xml;base64,${currentChat.avatarImage}`
                : sampleAvatar
            }
            alt="avatar"
          />
        </div>
        <div className="chat-user-details">
          <div className="chat-username">{currentChat.username}</div>
          <div className="chat-status" style={{ color: "green" }}>
            Online
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">No messages</div>
        ) : (
          messages.map((msg, index) => (
            <div key={uuidv4()} className="message" ref={scrollRef}>
              <div
                className={`message-content ${
                  msg.fromSelf ? "sent" : "receive"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="chat-input">
        <ChatInput onSend={handleSendMsg} />
      </div>
    </div>
  );
};

export default ChatContainer;
