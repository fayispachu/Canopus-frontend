import { createContext, useState, useEffect } from "react";
import AxiosInstance from "../lib/axios";

const WorkContext = createContext();

export const WorkProvider = ({ children }) => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch all works from backend
  const fetchWorks = async () => {
    try {
      setLoading(true);
      const res = await AxiosInstance.get("/work");
      setWorks(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch works.");
    } finally {
      setLoading(false);
    }
  };

  // Add new work
  const addWork = async (workData) => {
    try {
      const res = await AxiosInstance.post("/work", workData);
      setWorks((prev) => [...prev, res.data.work]);
      setMessage("Work added successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Add work failed.");
    }
  };

  // Update work
  const updateWork = async (workId, updatedData) => {
    try {
      const res = await AxiosInstance.put(`/work/${workId}`, updatedData);
      setWorks((prev) =>
        prev.map((w) => (w._id === workId ? res.data.work : w))
      );
      setMessage("Work updated successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Update work failed.");
    }
  };

  // Delete work
  const deleteWork = async (workId) => {
    try {
      await AxiosInstance.delete(`/work/${workId}`);
      setWorks((prev) => prev.filter((w) => w._id !== workId));
      setMessage("Work deleted successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Delete work failed.");
    }
  };

  // Mark assigned user's status for a specific work
  const markUserStatus = async (workId, userId, status) => {
    try {
      const res = await AxiosInstance.put(`/work/${workId}/status`, {
        userId,
        status, // "ready" | "pending" | "leave"
      });
      setWorks((prev) =>
        prev.map((w) => (w._id === workId ? res.data.work : w))
      );
      setMessage("User status updated.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update user status.");
    }
  };

  // Fetch single work with assigned user statuses
  const fetchWorkWithStatus = async (workId) => {
    try {
      const res = await AxiosInstance.get(`/work/${workId}`);
      return res.data;
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch work details.");
      return null;
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  return (
    <WorkContext.Provider
      value={{
        works,
        loading,
        message,
        fetchWorks,
        addWork,
        updateWork,
        deleteWork,
        markUserStatus,
        fetchWorkWithStatus,
        setMessage,
      }}
    >
      {children}
    </WorkContext.Provider>
  );
};

export default WorkContext;
