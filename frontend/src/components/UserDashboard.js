import React, { useState } from "react";
import AddComplaint from "./user/AddComplaint";
import ComplaintList from "./user/ComplaintList";
import styles from "./user/UserDashboard.module.css";

function UserDashboard({ user, onLogout }) {
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState("add"); // "add" or "view"

  const refreshList = () => setRefresh(!refresh);

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <button
            className={`${styles.navButton} ${activeTab === "add" ? styles.active : ""}`}
            onClick={() => setActiveTab("add")}
          >
            Add Complaint
          </button>
          <button
            className={`${styles.navButton} ${activeTab === "view" ? styles.active : ""}`}
            onClick={() => setActiveTab("view")}
          >
            View Complaints
          </button>
        </div>
        <div className={styles.navRight}>
          <h3>Welcome, {user.name}</h3>
          <button className={styles.logout} onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        {/* Add Complaint Form */}
<section
  className={`${styles.card} ${styles.formCard} ${
    activeTab !== "add" ? styles.hidden : ""
  }`}
>
  <AddComplaint userId={user.id} onAdded={refreshList} />
</section>

{/* View Complaints */}
<section
  className={`${styles.card} ${styles.tableCard} ${
    activeTab !== "view" ? styles.hidden : ""
  }`}
>
  <ComplaintList userId={user.id} refresh={refresh} />
</section>

      </main>
    </div>
  );
}

export default UserDashboard;
