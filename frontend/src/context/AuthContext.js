
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("access_token"));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
