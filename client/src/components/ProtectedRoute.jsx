import { useEffect, useState } from "react";
import { getAuthToken, removeAuthToken } from "../utils/utility";
import { redirect, useNavigate } from "react-router-dom";
import { verifyTokenRoute } from "../api/authApi";
import BeatLoader from "react-spinners/BeatLoader";
import PropTypes from "prop-types";

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
        const response = await verifyTokenRoute();
        if (response.data.status !== "success") {
          removeAuthToken();
          return navigate("/auth?mode=login");
        }
        setLoading(false);
      } catch (err) {
        redirect("/auth?mode=login");
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

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
