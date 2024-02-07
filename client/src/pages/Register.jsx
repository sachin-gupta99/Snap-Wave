import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { registerRoute } from "../utils/APIRoutes";
import { getAuthToken, setAuthToken } from "../utils/auth";
import Logo from "../assets/logo.png";
import "./Register.css";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  useEffect(() => {
    const user = getAuthToken();
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { username, email, password } = values;
      const registeredUser = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (registeredUser.data.status === "success") {
        toast.success("User registered successfully", toastOptions);
        setValues({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setAuthToken(registeredUser.data.token);
        navigate("/");
      } else {
        toast.error(registeredUser.data.message, toastOptions);
      }
    }
  };

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("Username must be at least 3 characters long", toastOptions);
      return false;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long", toastOptions);
      return false;
    } else if (!email.includes("@")) {
      toast.error("Email must be valid", toastOptions);
      return false;
    } else if (password.includes(username)) {
      toast.error("Password must not contain username", toastOptions);
      return false;
    } else if (password.includes(email)) {
      toast.error("Password must not contain email", toastOptions);
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
            type="text"
            id="email"
            name="email"
            value={values.email}
            placeholder="Email"
            title="Enter you Email"
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
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={values.confirmPassword}
            placeholder="Confirm Password"
            title="Enter you Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
    </>
  );
};

export default Register;
