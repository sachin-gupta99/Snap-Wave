import React, { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import cx from "classnames";
import Picker from "emoji-picker-react";
import PropTypes from "prop-types";

import classes from "./ChatInput.module.css";
import "./EmojiPicker.css";

const ChatInput = ({ onSend }) => {
  const pickerRef = useRef();

  const [message, setMessage] = useState("");
  const [emojiPicker, setEmojiPicker] = useState(false);

  const handleEmojiClick = (e) => {
    setMessage((prev) => prev + e.emoji);
  };

  const sendMsg = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (message.trim().length > 0) {
        onSend(message);
        setMessage("");
      }
    }
  };

  useEffect(() => {
    let handler = (e) => {
      if (!pickerRef.current.contains(e.target)) {
        setEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div className={classes["chat-input-container"]}>
      <div className={classes["emoji-container"]} ref={pickerRef}>
        <button
          className="chat-emoji"
          onClick={() => setEmojiPicker((prev) => !prev)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              setEmojiPicker((prev) => !prev);
            }
          }}
          tabIndex={0}
        >
          <BsEmojiSmile />
        </button>
        {/* <div
          className="chat-emoji"
          onClick={() => setEmojiPicker((prev) => !prev)}
        > */}
          {/* <BsEmojiSmile /> */}
        {/* </div> */}
        <div
          className={cx(
            classes["emoji-palette"],
            classes[`${emojiPicker ? "active" : "inactive"}`]
          )}
        >
          <Picker
            onEmojiClick={handleEmojiClick}
            width={"300px"}
            height={"400px"}
            emojiStyle="google"
          />
        </div>
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

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
};
