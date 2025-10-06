import { createContext, useState, useEffect } from "react";
import axios from "axios";
import AxiosInstance from "../lib/axios";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [loading, setLoading] = useState(false);

  // Set Axios default headers if token exists
  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("adminToken");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Admin login
  const loginAdmin = async (email, password) => {
    try {
      setLoading(true);
      const res = await AxiosInstance.post("/admin/login", {
        email,
        password,
      });
      setAdmin(res.data.admin);
      setToken(res.data.token);
      setLoading(false);
      return true;
    } catch (err) {
      console.error(err.response?.data || err);
      setLoading(false);
      return false;
    }
  };

  // Admin logout
  const logoutAdmin = () => {
    setAdmin(null);
    setToken("");
  };

  return (
    <AdminContext.Provider
      value={{ admin, token, loading, loginAdmin, logoutAdmin }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
