import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import DepartmentDashboard from "./components/department/DepartmentDashboard";
import WelcomePage from "./components/WelcomePage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowWelcome(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowSignup(false);
    setShowWelcome(true);
  };

  if (showWelcome && !currentUser) {
    return (
      <WelcomePage
        onLoginClick={() => { setShowWelcome(false); setShowSignup(false); }}
        onSignupClick={() => { setShowWelcome(false); setShowSignup(true); }}
      />
    );
  }

  if (!currentUser) {
    return showSignup ? (
      <Signup 
        onLoginClick={() => setShowSignup(false)}
        onWelcomeClick={() => { setShowSignup(false); setShowWelcome(true); }}
      />
    ) : (
      <Login
        onSignupClick={() => setShowSignup(true)}
        onLoginSuccess={handleLoginSuccess}
        onWelcomeClick={() => { setShowSignup(false); setShowWelcome(true); }}
      />
    );
  }

  if (currentUser.role === "user") {
    return <UserDashboard user={currentUser} onLogout={handleLogout} />;
  }
  if (currentUser.role === "admin") {
    return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  }
  if (currentUser.role === "department") {
    return <DepartmentDashboard user={currentUser} onLogout={handleLogout} />;
  }
  return <h2>Role dashboard not implemented yet</h2>;
}

export default App;
