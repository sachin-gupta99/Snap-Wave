import React from "react";
import { useSelector } from "react-redux";

import BeatLoader from "react-spinners/BeatLoader";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";

const override = {
  position: "relative",
  left: "45%",
  borderColor: "red",
};

const ChatBox = () => {
  const userDataLoading = useSelector((state) => state.user.userDataLoading);
  const userData = useSelector((state) => state.user.user);
  const selectedIndex = useSelector((state) => state.user.selectedContactIndex);

  return userDataLoading ? (
    <BeatLoader
      color="maroon"
      cssOverride={override}
      size={15}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  ) : (
    <>
      {selectedIndex === undefined ? (
        <Welcome username={userData? userData.username: "Username"} />
      ) : (
        <ChatContainer currentUser={userData} />
      )}
    </>
  );
};

export default ChatBox;
