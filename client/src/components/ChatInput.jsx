import React from "react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import classes from "./ChatInput.module.css";
import { useState } from "react";
import Picker from "emoji-picker-react";
import "./EmojiPicker.css";

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [emojiPicker, SetEmojiPicker] = useState(false);

  const handleEmojiPicker = () => {
    SetEmojiPicker(!emojiPicker);
  };

  const handleEmojiClick = (e) => {
    let emoji = e.emoji;
    setMessage(message + emoji);
  };

  const sendMsg = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (message.trim().length > 0) {
        onSend(message);
        setMessage("");
      }
    }
  };

  return (
    <div className={classes["chat-input-container"]}>
      <div className="chat-emoji" >
        <BsEmojiSmile onClick={handleEmojiPicker} />
        {emojiPicker && <Picker onEmojiClick={handleEmojiClick} width={"300px"} emojiStyle="google" />}
      </div>
      <div className={classes["chat-message"]}>
        <input
          type="text"
          placeholder="Type a message"
          className={classes["chat-message-input"]}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={sendMsg}
        />
      </div>
      <button className={classes["chat-send"]}>
        <IoMdSend onClick={sendMsg} />
      </button>
    </div>
  );
};

export default ChatInput;
