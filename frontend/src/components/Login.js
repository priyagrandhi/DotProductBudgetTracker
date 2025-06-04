import React, { useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

    axiosInstance.defaults.headers.common["Authorization"] =
      "Bearer " + response.data.access;
console.log("Response:", response.data);
      login();
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response);

      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-container" >
      <h2 style={{ marginLeft: "15px" }}>DotProduct Budget Tracker</h2>
      <form onSubmit={handleSubmit} style={{ marginLeft: "15px" }}>
        <input 
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

// eslint-disable-next-line no-undef
//console.log("Response:", response.data);

export default Login;
