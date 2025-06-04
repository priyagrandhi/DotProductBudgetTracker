import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear tokens from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Redirect to login
    navigate("/login");
   
  }, [navigate]);

  return <p>Logging out...</p>;
}

export default Logout;
