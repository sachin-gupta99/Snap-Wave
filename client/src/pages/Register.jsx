import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import './Register.css';

const Register = () => {
  const handleChange = (e) => {
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json.error) {
          alert(json.error);
        } else {
          alert("User created!");
        }
      });
  };
  return (
    <>
      <div className="form-container">
        <div className="form-heading">
          <img src={Logo} alt="Logo" />
          <span>Chat Application</span>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            id="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
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
