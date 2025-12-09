import React, { useState } from "react";
import API_URL from "../api";
import styles from "./Signup.module.css";

function Signup({ onLoginClick }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [departmentFields, setDepartmentFields] = useState({
    phone: "",
    designation: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check department fields if role is department
    if (role === "department") {
      if (!departmentFields.phone || !departmentFields.designation) {
        return alert("Please fill all department fields");
      }
    }

    const payload = {
      name,
      email,
      password,
      role,
      ...(role === "department" ? departmentFields : {}),
    };

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        onLoginClick();
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSignup}>
        <h2 className={styles.title}>Create Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          className={styles.input}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          {/* Department signup removed; only admin can create departments */}
        </select>

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

        {/* Removed duplicate select for role */}

        {/* Additional fields for department */}
        {role === "department" && (
          <>
            <input
              type="text"
              placeholder="Phone"
              className={styles.input}
              value={departmentFields.phone}
              onChange={(e) =>
                setDepartmentFields({ ...departmentFields, phone: e.target.value })
              }
              required
            />

            <input
              type="text"
              placeholder="Designation"
              className={styles.input}
              value={departmentFields.designation}
              onChange={(e) =>
                setDepartmentFields({ ...departmentFields, designation: e.target.value })
              }
              required
            />
          </>
        )}

        <button type="submit" className={styles.button}>
          Signup
        </button>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account?{" "}
          <span
            onClick={onLoginClick}
            style={{ color: "#20bf6b", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
