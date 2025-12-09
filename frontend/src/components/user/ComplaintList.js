import React, { useEffect, useState } from "react";
import API_URL from "../../api";
import styles from "./ComplaintList.module.css";

function ComplaintList({ userId, refresh }) {
  const [complaints, setComplaints] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState("");

  const token = localStorage.getItem("token");

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_URL}/complaints/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
    const interval = setInterval(fetchComplaints, 5000);
    return () => clearInterval(interval);
  }, [userId, token]);

  const startEdit = (c) => {
    setEditingId(c._id || c.id);
    setEditTitle(c.title);
    setEditDescription(c.description);
    setEditType(c.type);
  };

  const handleEdit = async (id) => {
    try {
      const res = await fetch(`${API_URL}/complaints/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          type: editType,
        }),
      });

      const data = await res.json();
      alert(data.message);

      setEditingId(null);
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/complaints/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      alert(data.message);
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------
  // 🔵 NEW CARDS SECTION
  // -------------------------------
  const totalComplaints = complaints.length;
  const completedComplaints = complaints.filter(
    (c) => c.status  === "Resolved"
  ).length;
  const inprogress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;
  const pendingComplaints = complaints.filter(
    (c) => c.status  === "Pending"
  ).length;

  return (
    <div className={styles.listContainer}>
      <h2>Your Complaints</h2>

      {/* 🔵 Added Stats Cards */}
      <div className={styles.statsCardContainer}>
        <div className={styles.statsCard}>
          <h3>Total Complaints</h3>
          <p>{totalComplaints}</p>
        </div>
        <div className={styles.statsCard}>
          <h3>In Progress</h3>
          <p>{inprogress}</p>
        </div>

        <div className={styles.statsCard}>
          <h3>Completed</h3>
          <p>{completedComplaints}</p>
        </div>

        <div className={styles.statsCard}>
          <h3>Pending</h3>
          <p>{pendingComplaints}</p>
        </div>
      </div>

      {complaints.length === 0 ? (
        <p>No complaints yet.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "60px" }}>ID</th>
                <th style={{ width: "180px" }}>Title</th>
                <th style={{ width: "140px" }}>Type</th>
                <th>Description</th>
                <th style={{ width: "160px" }}>Assigned To</th>
                <th style={{ width: "120px" }}>Status</th>
                <th style={{ width: "140px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((c) => {
                const cid = c._id || c.id;
                return editingId === cid ? (
                  <tr key={cid} className={styles.editRow}>
                    <td>{cid}</td>
                    <td>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className={styles.input}
                      />
                    </td>
                    <td>
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        className={styles.select}
                      >
                        <option value="Network Issue">Network Issue</option>
                        <option value="Hardware Issue">Hardware Issue</option>
                        <option value="Software Bug">Software Bug</option>
                        <option value="Other">Other</option>
                      </select>
                    </td>

                    <td>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className={styles.textarea}
                      />
                    </td>

                    <td>{c.department_name || "Not Assigned"}</td>
                    <td>{c.status}</td>

                    <td>
                      <button
                        onClick={() => handleEdit(cid)}
                        className={styles.button}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className={styles.buttonCancel}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={cid}>
                    <td>{cid}</td>
                    <td className={styles.titleCell}>{c.title}</td>
                    <td className={styles.typeCell}>{c.type}</td>
                    <td className={styles.descriptionCell} title={c.description}>
                      {c.description}
                    </td>

                    <td>
                      {c.department_name ||
                      (c.department_id && c.department_id.name) ? (
                        <span className={styles.assigned}>
                          {c.department_name || c.department_id.name}
                        </span>
                      ) : (
                        <span className={styles.notAssigned}>
                          Not Assigned
                        </span>
                      )}
                    </td>

                    <td>
                      {(() => {
                        const raw = c.status || "Pending";
                        const statusKey = raw.toLowerCase().replace(/\s+/g, "-");
                        return (
                          <span
                            className={`${styles.status} ${
                              styles[statusKey] || ""
                            }`}
                          >
                            {raw}
                          </span>
                        );
                      })()}
                    </td>

                    <td>
                      <button
                        onClick={() => startEdit(c)}
                        className={styles.button}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cid)}
                        className={styles.buttonCancel}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ComplaintList;
