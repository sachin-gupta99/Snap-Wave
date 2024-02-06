import React from "react";
import styled from "styled-components";
import sampleAvatar from "../assets/sample-avatar.jpg";

const Contacts = ({ index, contact, onClick, className }) => {
  const handleClick = () => {
    onClick(index);
  };
  return (
    <ContactContainer onClick={() => handleClick()} className={className}>
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
        <p className="contact__status">{contact.status}</p>
      </div>
    </ContactContainer>
  );
};

const ContactContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 0.25px;
  background-color: wheat;
  cursor: pointer;
  margin: 0.5rem 0;
  border-radius: 0.4rem;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: #f5f5f5;
  }
  &.selected {
    background-color: #f5f5f5;
  }
  .avatar {
    width: 50px;
    height: 2.5rem;
    border-radius: 50%;
    margin-right: 1rem;
  }
  .contact__details {
    display: flex;
    flex-direction: column;
  }
  .contact__username {
    font-size: 1rem;
    font-weight: 500;
  }
  .contact__status {
    font-size: 1rem;
    font-weight: 400;
  }
`;

export default Contacts;
