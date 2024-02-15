import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate, redirect, useSearchParams } from "react-router-dom";
import axios from "axios";

import {
  registerRoute,
  loginRoute,
  verifyTokenRoute,
} from "../utils/APIRoutes";
import { getAuthToken, setAuthToken, toastOptions } from "../utils/utility";
import Logo from "../assets/logo.png";
import "./Auth.css";
import "react-toastify/dist/ReactToastify.css";

const AuthPage = () => {
  const [params] = useSearchParams();
  const mode = params.get("mode");
  const navigate = useNavigate();
  const [values, setValues] = useState(
    mode === "login"
      ? {
          username: "",
          password: "",
        }
      : {
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }
  );

  useEffect(() => {
    if (mode !== "login" && mode !== "register") {
      navigate("/auth?mode=login");
    }
  }, [mode, navigate]);

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
      let registeredUser;
      if (mode === "login") {
        const { username, password } = values;
        registeredUser = await axios.post(loginRoute, {
          username,
          password,
        });
      } else {
        const { username, email, password } = values;
        registeredUser = await axios.post(registerRoute, {
          username,
          email,
          password,
        });
      }

      if (registeredUser.data.status === "success") {
        toast.success(
          `User ${mode === "login" ? "logged in" : "registered"} successfully"`,
          toastOptions
        );
        setValues(
          mode === "login"
            ? {
                username: "",
                password: "",
              }
            : {
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
              }
        );

        setAuthToken(registeredUser.data.token);
        navigate("/");
      } else {
        toast.error(registeredUser.data.message, toastOptions);
      }
    }
  };

  const handleValidation = () => {
    if (mode === "login") {
      const { username, password } = values;
      if (username.length < 3) {
        toast.error(
          "Username must be at least 3 characters long",
          toastOptions
        );
        return false;
      } else if (password.length < 6) {
        toast.error(
          "Password must be at least 6 characters long",
          toastOptions
        );
        return false;
      }
    } else {
      const { username, email, password, confirmPassword } = values;
      if (password !== confirmPassword) {
        toast.error("Passwords do not match", toastOptions);
        return false;
      } else if (username.length < 3) {
        toast.error(
          "Username must be at least 3 characters long",
          toastOptions
        );
        return false;
      } else if (password.length < 6) {
        toast.error(
          "Password must be at least 6 characters long",
          toastOptions
        );
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
    }
    return true;
  };

  return (
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
        {mode === "register" && (
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
        )}
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
        {mode === "register" && (
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
        )}
        <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
        <span>
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <Link
            to={mode === "login" ? "/auth?mode=register" : "/auth?mode=login"}
          >
            {mode === "login" ? "Register" : "Login"}
          </Link>
        </span>
      </form>
    </div>
  );
};

export default AuthPage;

export const LoginLoader = async () => {
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
