import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import loader from "../assets/loader.gif";
import { setAvatarRoute } from "../utils/APIRoutes";
import { getAuthToken } from "../utils/utility";
import "./SetAvatar.css";

const SetAvatar = () => {
  const AvatarAPI = "https://api.multiavatar.com/";
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState();

  const toastOptions = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    progress: undefined,
  };

  const setProfilePicture = async () => {
    try {
      const decodedToken = jwtDecode(getAuthToken());
      const response = await axios.post(
        `${setAvatarRoute}/${decodedToken._id}`,
        {
          avatar: avatars[selectedAvatar],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Profile picture set successfully", toastOptions);
        navigate("/");
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
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    try {
      const fetchAvatars = async () => {
        const tempAvatars = [];
        for (let i = 0; i < 5; i++) {
          const image = await axios.get(
            `${AvatarAPI}${Math.round(Math.random() * 1000)}?apikey=${
              process.env.MULTIAVATAR_API_KEY
            }`
          );
          const buffer = new Buffer(image.data).toString("base64");
          tempAvatars.push(buffer);
        }

        setAvatars(tempAvatars);
        setLoading(false);
      };
      fetchAvatars();
    } catch (error) {
      toast.error("Error fetching avatars", toastOptions);
    }
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
