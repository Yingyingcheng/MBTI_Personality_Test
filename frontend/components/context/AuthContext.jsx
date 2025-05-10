import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Helper function to safely access localStorage
const getStoredToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(getStoredToken());

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      if (token) {
        try {
          const response = await fetch("/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setCurrentUser(data.user);
          } else {
            // Token invalid, remove it
            if (typeof window !== "undefined") {
              localStorage.removeItem("token");
            }
            setToken(null);
          }
        } catch (error) {
          console.error("Error checking login status:", error);
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
          }
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkLoginStatus();
  }, [token]);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
      }
      setToken(data.token);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
      }
      setToken(data.token);
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setToken(null);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
