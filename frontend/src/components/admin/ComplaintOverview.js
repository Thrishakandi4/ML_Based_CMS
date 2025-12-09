import React, { useEffect, useState } from "react";
import API_URL from "../../api";

function ComplaintOverview() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/complaints`,{
          headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
        });
        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComplaints();
  }, []);

  const handleStatusChange = async (id, status) => {
  try {
    await fetch(`${API_URL}/admin/complaints/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}` // <-- add this
      },
      body: JSON.stringify({ status }),
    });
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div>
      <h2>All Complaints</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Assign Department</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.user_name}</td>
              <td>{c.title}</td>
              <td>{c.description}</td>
              <td>
                <select
                  value={c.status}
                  onChange={(e) => handleStatusChange(c.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </td>
              <td>{c.department || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComplaintOverview;
