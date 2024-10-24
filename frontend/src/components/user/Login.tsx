import React, { useState } from "react";
import "../../stylesheets/form/form.css";
import "../../stylesheets/login/login.css";

const Login: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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
        console.log("Login successful:", data);
        // Handle successful login, e.g., redirect to dashboard
      } else {
        setError("Login failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
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
