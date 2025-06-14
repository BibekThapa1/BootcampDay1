import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import SummaryApi from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ status: false, userData: undefined });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(SummaryApi.getMyInfo.url, {
          withCredentials: true,
        });
        console.log("asdf", response);
        if (response.data && response.data.success && response.data.user) {
          setAuth({ status: true, userData: response.data.user });
        } else {
          setAuth({ status: false, userData: undefined });
        }
      } catch (error) {
        setAuth({ status: false, userData: undefined });
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      console.log("object");
      const response = await axios.post(
        SummaryApi.login.url,
        { email, password },
        { withCredentials: true }
      );
      console.log(response);
      if (response.data.success && response.data.user) {
        console.log("1", response.data.user);
        setAuth({ status: true, userData: response.data.user });
        if (response.data.user.role === "admin") {
          window.location.href = "/admin/dashboard";
        }
        if (response.data.user.role === "user") {
          window.location.href = "/";
        }
        return { success: true };
      } else {
        setAuth({ status: false, userData: undefined });
        return {
          success: false,
          message: response.data.message || "Login failed",
        };
      }
    } catch (error) {
      setAuth({ status: false, userData: undefined });
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.get(SummaryApi.logout.url, { withCredentials: true });
      setAuth({ status: false, userData: undefined });
    } catch (error) {
      // Ignore error
    } finally {
      setAuth({ status: false, userData: undefined });
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
