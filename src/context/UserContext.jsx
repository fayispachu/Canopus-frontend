import { createContext, useState, useEffect } from "react";
import AxiosInstance from "../lib/axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: true,
  });

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setNotifications(
        parsedUser.notifications || { email: true, whatsapp: true }
      );
    }
  }, []);

  const registerUser = async (userData) => {
    try {
      const res = await AxiosInstance.post("/user/register", userData);
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data.user;
    } catch (err) {
      console.error(err.response?.data || err);
      throw err;
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await AxiosInstance.post("/user/login", { email, password });
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      console.log("User logged in:", res.data.user);

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
    setNotifications({ email: true, whatsapp: true });
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        notifications,
        setUser,
        registerUser,
        loginUser,
        updateUser,
        updateNotifications,
        toggleAttendance,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
