import { useEffect, useState } from "react";
import { getAuthToken, removeAuthToken } from "../utils/auth";
import { redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import { verifyTokenRoute } from "../utils/APIRoutes";
import BeatLoader from "react-spinners/BeatLoader";

const override = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderColor: "red",
};

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = getAuthToken();

  useEffect(() => {
    setLoading(true);
    const verifyToken = async () => {
      try {
        const response = await axios.post(
          verifyTokenRoute,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status !== "success") {
          removeAuthToken();
          return navigate("/login");
        }
        setLoading(false);
      } catch (err) {
        redirect("/login");
        setLoading(false);
      }
    };
    verifyToken();
  }, [token, navigate]);

  return loading ? (
    <BeatLoader
      color="maroon"
      cssOverride={override}
      size={20}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  ) : (
    children
  );
};

export default ProtectedRoute;
