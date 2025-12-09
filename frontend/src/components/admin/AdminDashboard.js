import React, { useState, useEffect } from "react";
import API_URL from "../../api";
import styles from "./AdminDashboard.module.css";
import DepartmentCategoryManager from "./DepartmentCategoryManager";
import DepartmentList from "./DepartmentList";

function AdminDashboard({ user, onLogout }) {
    const [showCreateDept, setShowCreateDept] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [filterDept, setFilterDept] = useState("");
  const token = localStorage.getItem("token");

  /** Fetch Departments */
  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Department fetch error:", err);
    }
  };

  /** Fetch Complaints */
  const fetchComplaints = async () => {
    try {
      const url = filterDept
        ? `${API_URL}/admin/complaints?departmentId=${filterDept}`
        : `${API_URL}/admin/complaints`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Complaints fetch error:", err);
    }
  };

  /** Initial Load */
  useEffect(() => {
    if (!token) return;
    fetchDepartments();
    fetchComplaints();
  }, [token, filterDept]);

  /** Assign Complaint */
  const handleAssign = async (complaintId) => {
    const departmentId = assignments[complaintId];
    if (!departmentId) return alert("Select a department");

    try {
      const res = await fetch(`${API_URL}/admin/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ complaintId, departmentId }),
      });

      const data = await res.json();
      if (data.message) alert(data.message);

      // Refresh complaints list after assignment
      fetchComplaints();
    } catch (err) {
      console.error(err);
      alert("Error assigning complaint");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <span className={styles.navTitle}>Admin Dashboard</span>
        <button className={styles.navButton} onClick={() => setShowCreateDept(true)}>Create Department</button>
        <button
          className={`${styles.logout} ${styles.navButton}`}
          onClick={() => {
            localStorage.removeItem("token");
            onLogout();
          }}
        >
          Logout
        </button>
      </nav>

      {/* Modal or Section for Create Department */}
      {showCreateDept && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: 32, borderRadius: 12, minWidth: 350, boxShadow: "0 2px 16px rgba(0,0,0,0.15)" }}>
            <h2 style={{ marginTop: 0 }}>Create Department</h2>
            <DepartmentList departments={departments} setDepartments={setDepartments} fetchDepartments={fetchDepartments} />
            <button onClick={() => setShowCreateDept(false)} style={{ marginTop: 16, padding: "6px 16px", borderRadius: 6, border: "none", background: "#6c757d", color: "#fff", cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}

      <main className={styles.main}>
        {/* Filter Section */}
        <section className={styles.card}>
          <h2>Filter by Department</h2>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.designation || d.name}
              </option>
            ))}
          </select>
        </section>

        {/* Complaints Table */}
        <section className={styles.card} style={{ width: "100%" }}>
          <h2>All Complaints</h2>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Confidence</th>
                  <th>Department</th>
                  <th>Assign</th>
                </tr>
              </thead>

              <tbody>
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center" }}>
                      No complaints found
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

                      {/* Priority badge */}
                      <td>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            color: "#fff",
                            background:
                              c.priority === "High"
                                ? "#d9534f"
                                : c.priority === "Medium"
                                ? "#f0ad4e"
                                : c.priority === "Low"
                                ? "#5cb85c"
                                : "#6c757d",
                            minWidth: "60px",
                            display: "inline-block",
                            textAlign: "center",
                          }}
                        >
                          {c.priority || "—"}
                        </span>
                      </td>

                      {/* Confidence */}
                      <td>{c.priority_confidence ? `${(c.priority_confidence * 100).toFixed(0)}%` : "—"}</td>

                      <td>{c.department_name || "Not assigned"}</td>

                      <td>
                        <select
                          value={assignments[c.id] || ""}
                          onChange={(e) =>
                            setAssignments({
                              ...assignments,
                              [c.id]: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Department</option>
                          {departments.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.designation || d.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssign(c.id)}
                          className={styles.button}
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      {/* DepartmentList is now shown in modal only */}
      {/* DepartmentCategoryManager removed as requested */}
    </main>
  </div>
 );
}

export default AdminDashboard;
