import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, redirect, useNavigate } from "react-router-dom";
import axios from "axios";

import { loginRoute } from "../utils/APIRoutes";
import { getAuthToken } from "../utils/utility";
import { verifyTokenRoute } from "../utils/APIRoutes";
import { toastOptions } from "../utils/utility";
import Logo from "../assets/logo.png";
import "./Register.css";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const userToken = getAuthToken();
    if (userToken) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { username, password } = values;
      const registeredUser = await axios.post(loginRoute, {
        username,
        password,
      });

      if (registeredUser.data.status === "success") {
        toast.success("User logged in successfully", toastOptions);
        setValues({
          username: "",
          password: "",
        });
        localStorage.setItem("chat-app-user-token", registeredUser.data.token);
        navigate("/");
      } else {
        toast.error(registeredUser.data.message, toastOptions);
      }
    }
  };

  const handleValidation = () => {
    const { username, password } = values;
    if (username.length < 3) {
      toast.error("Username must be at least 3 characters long", toastOptions);
      return false;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long", toastOptions);
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="form-container">
        <div className="form-heading">
          <img src={Logo} alt="Logo" />
          <span>Snap-Wave</span>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            name="username"
            value={values.username}
            placeholder="Username"
            title="Enter you Username"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            placeholder="Password"
            title="Enter you Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
          <span>
            Don't have an account? <Link to="/register">Register</Link>
          </span>
        </form>
      </div>
    </>
  );
};

export default Login;

export const loader = async () => {
  const token = getAuthToken();
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
  if (response.data.status === "success") {
    return redirect("/");
  }
  return null;
};
