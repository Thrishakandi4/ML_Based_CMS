import React, { useState } from "react";
import API_URL from "../../api";
import styles from "./AddComplaint.module.css";

function AddComplaint({ userId, onAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Network Issue");

  const token = localStorage.getItem("token"); // ✅ Get token

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ Include token
        },
        body: JSON.stringify({ title, description, type }), // user_id not needed if backend uses JWT
      });

      const data = await res.json();
      alert(data.message || "Complaint submitted");
      onAdded();
      setTitle("");
      setDescription("");
      setType("Network Issue");
    } catch (err) {
      console.error(err);
      alert("Error creating complaint");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Create Complaint</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Network Issue">Network Issue</option>
        <option value="Hardware Issue">Hardware Issue</option>
        <option value="Software Bug">Software Bug</option>
        <option value="Other">Other</option>
      </select>
      <button className={styles.button} type="submit">
        Submit Complaint
      </button>
    </form>
  );
}

export default AddComplaint;
