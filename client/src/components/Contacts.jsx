import React from "react";
import sampleAvatar from "../assets/sample-avatar.jpg";
import "./Contacts.css";

const Contacts = ({ index, contact, onClick, className }) => {
  const handleClick = () => {
    onClick(index);
  };
  return (
    <div
      onClick={() => handleClick()}
      className={`contact-container ${className}`}
    >
      <img
        src={
          contact.avatarImage
            ? `data:image/svg+xml;base64,${contact.avatarImage}`
            : sampleAvatar
        }
        alt="avatar"
        className="avatar"
      />
      <div className="contact__details">
        <h3 className="contact__username">{contact.username}</h3>
        <p className="contact__status"></p>
      </div>
    </div>
  );
};

export default Contacts;
