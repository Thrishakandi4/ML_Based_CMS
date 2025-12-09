import React, { useEffect, useState } from "react";
import API_URL from "../../api";

function DepartmentList({ departments, setDepartments, fetchDepartments }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [password, setPassword] = useState("");
  const token = localStorage.getItem("token");

  // fetchDepartments is now passed from parent

  const handleAdd = async () => {
    if (!name || !email) return alert("Enter department name and email");

    try {
      const res = await fetch(`${API_URL}/admin/departments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          designation,
          password_hash: password,
        }),
      });
      const data = await res.json();
      alert(data.message || "Department added");
      setName("");
      setEmail("");
      setPhone("");
      setDesignation("");
      setPassword("");
      fetchDepartments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}?role=department`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      alert(data.message);
      fetchDepartments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Departments</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
        />
        <input
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          placeholder="Designation"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      <ul>
        {departments.map((d) => (
          <li key={d.id}>
            {d.name} <button onClick={() => handleDelete(d.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DepartmentList;
