import React from "react";
import sampleAvatar from "../assets/sample-avatar.jpg";
import "./ChatContainer.css";
import ChatInput from "./ChatInput";

const ChatContainer = ({ currentChat }) => {
  console.log(currentChat);
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
          <div className="chat-status" style={{color: "green"}}>Online</div>
        </div>
      </div>
      <div className="chat-messages">Chat messages here</div>
      <div className="chat-input">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatContainer;
