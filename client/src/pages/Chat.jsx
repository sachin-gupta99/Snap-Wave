import React from "react";
import AllContacts from "../components/AllContacts";
import SelfDetails from "../components/SelfDetails";
import ChatBox from "../components/ChatBox";
import "./Chat.css";

const Chat = () => {
  return (
    <div className="chat-container-main">
      <div className="chat-subcontainer">
        <div className="chat-list">
          <div className="all-contacts">
            <AllContacts />
          </div>

          <div className="self_details__container">
            <SelfDetails />
          </div>
        </div>

        <div className="chat-box">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default Chat;
