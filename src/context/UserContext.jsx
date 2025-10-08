import { createContext, useState, useEffect } from "react";
import AxiosInstance from "../lib/axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]); // all users including customers
  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setNotifications(
        parsedUser.notifications || { email: true, whatsapp: true }
      );
    }
    fetchAllUsers(); // fetch users on load
    setLoading(false);
  }, []);

  // Fetch all users (admin/managers)
  const fetchAllUsers = async () => {
    try {
      const res = await AxiosInstance.get("/user/users");
      setAllUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  // Register normal user (public)
  const registerUser = async (userData) => {
    try {
      const res = await AxiosInstance.post("/user/register", userData);
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      await fetchAllUsers();
      return res.data.user;
    } catch (err) {
      console.error(err.response?.data || err);
      throw err;
    }
  };

  // Admin creating user
  const createUser = async (userData) => {
    try {
      const res = await AxiosInstance.post("/user/register/create", userData);
      // update allUsers state to include the new user
      setAllUsers((prev) => [...prev, res.data.user]);
      return res.data.user;
    } catch (err) {
      console.error("Failed to create user:", err.response?.data || err);
      throw err;
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await AxiosInstance.post("/user/login", { email, password });
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      await fetchAllUsers();
      return res.data.user;
    } catch (err) {
      console.error(err.response?.data || err);
      throw err;
    }
  };

  const updateUser = async (updates) => {
    if (!user) return;
    try {
      const res = await AxiosInstance.put(`/user/profile/${user._id}`, updates);
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      await fetchAllUsers();
      return res.data.user;
    } catch (err) {
      console.error(err);
    }
  };

  const updateNotifications = async (prefs) => {
    if (!user) return;
    try {
      const res = await AxiosInstance.put(
        `/user/profile/${user._id}/notifications`,
        prefs
      );
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAttendance = () => {
    if (!user) return;
    const updated = { ...user, attendance: !user.attendance };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  const logoutUser = () => {
    setUser(null);
    setAllUsers([]);
    setNotifications({ email: true, whatsapp: true });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        allUsers,
        notifications,
        loading,
        setUser,
        registerUser,
        createUser, // 👈 added
        loginUser,
        updateUser,
        updateNotifications,
        toggleAttendance,
        logoutUser,
        fetchAllUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
