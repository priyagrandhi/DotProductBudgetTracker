import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "10px 20px",
        background: "#eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left side: Logo or App Name */}
      <div style={{ fontWeight: "bold", fontSize: "18px" }}>
        DotProduct Monthly Budget Tracker</div>

      {/* Right side: Navigation links */}
      <div>
        {isAuthenticated && (
          <>
            <Link to="/dashboard" style={{ marginRight: "15px" }}>
              Dashboard
            </Link>
            <Link to="/transactions" style={{ marginRight: "15px" }}>
              Transactions
            </Link>
            <button onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </button>
          </>
        )}
        {!isAuthenticated && (
          <Link to="/login" style={{ marginLeft: "15px" }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
