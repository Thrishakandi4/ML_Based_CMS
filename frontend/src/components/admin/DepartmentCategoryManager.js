import React, { useEffect, useState } from "react";
import API_URL from "../../api";

const DepartmentCategoryManager = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategories, setNewCategories] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/admin/departments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(setDepartments);
  }, []);

  useEffect(() => {
    if (selectedDept) {
      setLoading(true);
      fetch(`${API_URL}/admin/departments/${selectedDept}/categories`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then(res => res.json())
        .then(data => {
          setCategories(data.categories || []);
          setLoading(false);
        });
    } else {
      setCategories([]);
    }
  }, [selectedDept]);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedDept || !newCategories.trim()) return;
    setLoading(true);
    setMessage("");
    const cats = newCategories.split(",").map(c => c.trim()).filter(Boolean);
    const res = await fetch(`${API_URL}/admin/departments/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ departmentId: selectedDept, categories: cats })
    });
    const data = await res.json();
    setMessage(data.message || "Categories updated");
    setNewCategories("");
    setLoading(false);
    setCategories(cats);
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: 8, marginTop: 24 }}>
      <h2>Assign Categories to Department</h2>
      <label>
        Select Department:
        <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
          <option value="">-- Select --</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name} ({d.designation})</option>
          ))}
        </select>
      </label>
      {selectedDept && (
        <>
          <div style={{ margin: "1rem 0" }}>
            <strong>Current Categories:</strong> {categories.length ? categories.join(", ") : "None"}
          </div>
          <form onSubmit={handleAssign}>
            <label>
              Assign Categories (comma separated):
              <input
                type="text"
                value={newCategories}
                onChange={e => setNewCategories(e.target.value)}
                placeholder="e.g. Electrical, Plumbing, Food"
                style={{ marginLeft: 8, width: 240 }}
                disabled={loading}
              />
            </label>
            <button type="submit" disabled={loading || !newCategories.trim()} style={{ marginLeft: 12 }}>
              {loading ? "Saving..." : "Assign"}
            </button>
          </form>
          {message && <div style={{ color: "green", marginTop: 8 }}>{message}</div>}
        </>
      )}
    </div>
  );
};

export default DepartmentCategoryManager;
