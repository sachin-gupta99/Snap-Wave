import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { Buffer } from "buffer";

import loader from "../assets/loader.gif";
import { getAvatarRoute, setAvatarRoute } from "../api/userApi";
import { getAuthToken, toastOptions } from "../utils/utility";
import "./SetAvatar.css";
import { router } from "../App";

const SetAvatar = () => {
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState();

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
    const fetchAvatars = async () => {
      try {
        const avatars = await getAvatarRoute(jwtDecode(getAuthToken())._id);
        for(let i = 0; i < avatars.data.avatars.length; i++) {
          const buffer = Buffer.from(avatars.data.avatars[i]).toString("base64");
          avatars.data.avatars[i] = buffer;
        }
        setAvatars(avatars.data.avatars);
        setLoading(false);
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
                    onClick={() => setSelectedAvatar(index)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        setSelectedAvatar(index);
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
