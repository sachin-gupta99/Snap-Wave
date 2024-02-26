import React, { useEffect } from "react";
import { Buffer } from "buffer";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import loader from "../assets/loader.gif";
import { setAvatarRoute } from "../api/userApi";
import { getAuthToken, toastOptions } from "../utils/utility";
import "./SetAvatar.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user";
import { router } from "../App";

const SetAvatar = () => {
  const AvatarAPI = "https://api.multiavatar.com/";
  const dispatch = useDispatch();
  const avatars = useSelector((state) => state.user.avatars);
  const loading = useSelector((state) => state.user.avatarLoading);
  const selectedAvatar = useSelector((state) => state.user.selectedAvatar);

  const setProfilePicture = async () => {
    try {
      const decodedToken = jwtDecode(getAuthToken());

      const response = await setAvatarRoute(decodedToken._id, {
        avatar: avatars[selectedAvatar],
      });

      if (response.data.status === "success") {
        toast.success(
          "Profile picture set successfully. Please reload to see the effect",
          toastOptions
        );
        router.navigate("/");
      } else {
        toast.error("Error setting profile picture", toastOptions);
      }
    } catch (err) {
      toast.error("Error setting profile picture", toastOptions);
    }
  };

  useEffect(() => {
    const user = getAuthToken();
    if (!user) {
      router.navigate("/auth?mode=login");
    }
  }, []);

  useEffect(() => {
    const crypto = window.crypto || window.Crypto;
    const array = new Uint32Array(1);

    const fetchAvatars = async () => {
      try {
        const tempAvatars = [];
        for (let i = 0; i < 5; i++) {
          const image = await axios.get(
            `${AvatarAPI}${crypto.getRandomValues(array)}?apikey=${
              process.env.MULTIAVATAR_API_KEY
            }`
          );
          const buffer = Buffer.from(image.data).toString("base64");
          tempAvatars.push(buffer);
        }
        dispatch(userActions.setAvatars(tempAvatars));
        dispatch(userActions.setAvatarLoading(false));
      } catch (error) {
        toast.error("Error fetching avatars", toastOptions);
      }
    };

    fetchAvatars();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading ? (
        <div className="container">
          <img src={loader} alt="loader" />
        </div>
      ) : (
        <div className="container">
          <div className="title-container">
            Pick an Avatar as your Profile Picture
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                  key={index}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() =>
                      dispatch(userActions.setSelectedAvatar(index))
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        dispatch(userActions.setSelectedAvatar(index));
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set Profile Picture
          </button>
        </div>
      )}
    </>
  );
};

export default SetAvatar;
