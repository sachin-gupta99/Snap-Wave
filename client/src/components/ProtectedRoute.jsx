import { useEffect } from "react";
import { getAuthToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const navigate = useNavigate(); 
    const token = getAuthToken();

    useEffect (() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    return <>{children}</>;
};

export default ProtectedRoute;
