import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import DepartmentDashboard from "./components/department/DepartmentDashboard";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginSuccess = (user) => setCurrentUser(user);

  const handleLogout = () => {
    setCurrentUser(null);
    setShowSignup(false);
  };

  return (
    <>
      {!currentUser ? (
        showSignup ? (
          <Signup onLoginClick={() => setShowSignup(false)} />
        ) : (
          <Login
            onSignupClick={() => setShowSignup(true)}
            onLoginSuccess={handleLoginSuccess}
          />
        )
      ) : currentUser.role === "user" ? (
        <UserDashboard user={currentUser} onLogout={handleLogout} />
      ) : currentUser.role === "admin" ? (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      ) : currentUser.role === "department" ? (
        <DepartmentDashboard user={currentUser} onLogout={handleLogout} />
      ) : null}
    </>
  );

  return <h2>Role dashboard not implemented yet</h2>;
}

export default App;
