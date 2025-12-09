import React, { useState } from "react";
import API_URL from "../api";
import styles from "./Login.module.css";

function Login({ onSignupClick, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      alert(data.message);

      if (!res.ok) return;

      // Save token
      localStorage.setItem("token", data.token);

      // 🔥 Identify whether backend returned user or department
      const loggedInUser = data.user || data.department;

      // 🔥 Pass correct object to App.js
      onLoginSuccess(loggedInUser);

    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleLogin}>
        <h2 className={styles.title}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.button}>
          Login
        </button>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          {/* Only show signup for users/admins, not departments */}
          Don't have a user or admin account?{" "}
          <span
            onClick={onSignupClick}
            style={{ color: "#4b7bec", cursor: "pointer" }}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
