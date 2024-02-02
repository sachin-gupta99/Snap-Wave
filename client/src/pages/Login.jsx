import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loginRoute } from "../utils/APIRoutes";
import Logo from "../assets/logo.png";
import "./Register.css";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
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
    const user = JSON.parse(localStorage.getItem("chat-app-user"));
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
        localStorage.setItem(
          "chat-app-user",
          JSON.stringify(registeredUser.data.user)
        );
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
