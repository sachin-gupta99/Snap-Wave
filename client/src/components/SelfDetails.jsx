import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";

import { userActions } from "../store/user";

const override = {
  position: "relative",
  transform: "rotate(90deg)",
  borderColor: "red",
};

const SelfDetails = () => {
  const dispatch = useDispatch();
  const userDataLoading = useSelector((state) => state.user.userDataLoading);
  const userData = useSelector((state) => state.user.user);

  useEffect(() => {
    if (userData) {
      dispatch(userActions.setUserDataLoading(false));
    }
  }, [userData, dispatch]);

  return userDataLoading ? (
    <BeatLoader
      color="maroon"
      cssOverride={override}
      size={10}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  ) : (
    <>
      <div className="self_details__avatar">
        <img
          src={
            userData
              ? userData.avatarImage
                ? `data:image/svg+xml;base64,${userData.avatarImage}`
                : "https://www.gravatar.com/avatar/000?d=mp"
              : "https://www.gravatar.com/avatar/000?d=mp"
          }
          alt="avatar"
        />
      </div>
      <div className="self_details__username">
        {userData.username || "Username"}
      </div>
      <div className="self_details__email">{userData.email || "Email"}</div>
    </>
  );
};

export default SelfDetails;
