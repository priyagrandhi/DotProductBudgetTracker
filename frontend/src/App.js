import React,{useEffect} from "react";
import { BrowserRouter as Router, Routes, Route,Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import Transactions from "./components/Transactions";

import axiosInstance from "./api/axiosInstance";
function AppWrapper() {
  const location = useLocation();

  // Hide Navbar on login page
  const hideNavbarPaths = ["/login"];
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  useEffect(() => {
    // ✅ On app mount/reload, restore token to axiosInstance if present
    const token = localStorage.getItem("access_token");
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route
  path="/transactions"
  element={
    <PrivateRoute>
      <Transactions />
    </PrivateRoute>
  }
/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;