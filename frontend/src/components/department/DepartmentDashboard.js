import React, { useState, useEffect } from "react";
import API_URL from "../../api";
import styles from "./DepartmentDashboard.module.css";

function DepartmentDashboard({ user, onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});
  const token = localStorage.getItem("token");

  /** Fetch complaints assigned to this department */
  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_URL}/department/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    if (token) fetchComplaints();
  }, [token]);

  /** Update status of a complaint */
  const handleStatusUpdate = async (id) => {
    const newStatus = statusUpdates[id];
    if (!newStatus) return alert("Select a status");

    try {
      // Backend route expects PUT /api/department/:id/status
      const res = await fetch(`${API_URL}/department/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.message) alert(data.message);

      // Refresh list after updating
      fetchComplaints();

      setStatusUpdates((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome, {user.name}</h1>
        <button
          className={styles.logout}
          onClick={() => {
            localStorage.removeItem("token");
            onLogout();
          }}
        >
          Logout
        </button>
      </header>

      <main className={styles.main}>
        <section className={styles.card}>
          <h2>Assigned Complaints</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No complaints assigned
                    </td>
                  </tr>
                ) : (
                  complaints.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.title}</td>
                      <td>{c.type || c.complaint_type}</td>
                      <td>{c.description}</td>
                      <td>{c.status}</td>
                      <td>
                        <select
                          value={statusUpdates[c.id] || ""}
                          onChange={(e) =>
                            setStatusUpdates({
                              ...statusUpdates,
                              [c.id]: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Status</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>

                        <button
                          onClick={() => handleStatusUpdate(c.id)}
                          className={styles.button}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DepartmentDashboard;
