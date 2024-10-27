import React, { useState, useEffect } from "react";
import "../../stylesheets/form/form.css";
import "../../stylesheets/login/login.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [error, setError] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsAuthenticated(true);
        navigate("/");
        if (data.user.setup) {
          navigate("/setup");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Login failed");
        setIsAuthenticated(false);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.log(error);
      setIsAuthenticated(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1>Login</h1>
        <form className="loginForm" onSubmit={submitLogin}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            className="username"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <button className="button" type="submit">
            Login
          </button>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
