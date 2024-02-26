import React, { useEffect, useRef } from "react";
import { Link, redirect, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { registerRoute, loginRoute, verifyTokenRoute } from "../api/authApi";
import { getAuthToken, setAuthToken, toastOptions } from "../utils/utility";
import Logo from "../assets/logo.png";
import { router } from "../App";
import "./Auth.css";

const AuthPage = () => {
  const [params] = useSearchParams();
  const mode = params.get("mode");
  const emailRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  useEffect(() => {
    if (mode !== "login" && mode !== "register") {
      router.navigate("/auth?mode=login");
    }
  }, [mode]);

  useEffect(() => {
    const userToken = getAuthToken();
    if (userToken) {
      router.navigate("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      let registeredUser;
      if (mode === "login") {
        const { username, password } = {
          username: usernameRef.current.value,
          password: passwordRef.current.value,
        };
        registeredUser = await loginRoute({ username, password });
      } else {
        const { username, email, password } = {
          username: usernameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
        };
        registeredUser = await registerRoute({ username, email, password });
      }

      if (registeredUser.data.status === "success") {
        toast.success(
          `User ${mode === "login" ? "logged in" : "registered"} successfully"`,
          toastOptions
        );

        usernameRef.current.value = "";
        passwordRef.current.value = "";

        if (mode === "register") {
          emailRef.current.value = "";
          confirmPasswordRef.current.value = "";
        }
        setAuthToken(registeredUser.data.token);
        router.navigate("/");
      } else {
        toast.error(registeredUser.data.message, toastOptions);
      }
    }
  };

  const handleValidation = () => {
    if (mode === "login") {
      const { username, password } = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      };
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
      const { username, email, password, confirmPassword } = {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        confirmPassword: confirmPasswordRef.current.value,
      };
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
          ref={usernameRef}
          placeholder="Username"
          title="Enter you Username"
          required
        />
        {mode === "register" && (
          <input
            type="text"
            id="email"
            name="email"
            ref={emailRef}
            placeholder="Email"
            title="Enter you Email"
            required
          />
        )}
        <input
          type="password"
          id="password"
          name="password"
          ref={passwordRef}
          placeholder="Password"
          title="Enter you Password"
          required
        />
        {mode === "register" && (
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            ref={confirmPasswordRef}
            placeholder="Confirm Password"
            title="Enter you Password"
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
  const response = await verifyTokenRoute();
  if (response.data.status === "success") {
    return redirect("/");
  }
  return null;
};
