import { createContext, useState, useEffect } from "react";
import AxiosInstance from "../lib/axios";
import toast from "react-hot-toast";

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
      console.log("Fetched works:", res.data.length);

      // Log assigned user names
      res.data.forEach((work) => {
        const assignedNames = work.assignedTo
          .map((a) => (a.user ? a.user.name : "Unknown"))
          .join(", ");
        console.log(`Work: ${work.title} | Assigned to: ${assignedNames}`);
      });

      setWorks(res.data);
    } catch (err) {
      console.error("Fetch Works Error:", err);
      setMessage("Failed to fetch works.");
      toast.error("Failed to fetch works.");
    } finally {
      setLoading(false);
    }
  };

  // Normalize assignedTo IDs
  const normalizeAssignedTo = (assignedTo) => {
    if (!assignedTo) return [];
    if (!Array.isArray(assignedTo)) assignedTo = [assignedTo];
    return assignedTo
      .map((id) => {
        if (!id) return null;
        if (typeof id === "string") return id;
        if (typeof id === "object" && id.value) return id.value;
        return null;
      })
      .filter(Boolean);
  };

  // Add new work
  const addWork = async (workData) => {
    try {
      workData.assignedTo = normalizeAssignedTo(workData.assignedTo);

      console.log("Adding work with data:", workData);

      const res = await AxiosInstance.post("/work", workData);
      setWorks((prev) => [...prev, res.data.work]);
      setMessage("Work added successfully.");
      toast.success("Work added successfully!");

      // Log assigned user names
      const assignedNames = res.data.work.assignedTo
        .map((a) => (a.user ? a.user.name : "Unknown"))
        .join(", ");
      console.log(
        `New Work: ${res.data.work.title} | Assigned to: ${assignedNames}`
      );
    } catch (err) {
      console.error("Add Work Error:", err);
      setMessage("Add work failed.");
      toast.error(err?.response?.data?.message || "Add work failed");
    }
  };

  // Update work
  const updateWork = async (workId, updatedData) => {
    try {
      updatedData.assignedTo = normalizeAssignedTo(updatedData.assignedTo);

      console.log("Updating work:", workId, updatedData);

      const res = await AxiosInstance.put(`/work/${workId}`, updatedData);
      setWorks((prev) =>
        prev.map((w) => (w._id === workId ? res.data.work : w))
      );
      setMessage("Work updated successfully.");
      toast.success("Work updated successfully!");
    } catch (err) {
      console.error("Update Work Error:", err);
      setMessage("Update work failed.");
      toast.error(err?.response?.data?.message || "Update work failed");
    }
  };

  // Delete work
  const deleteWork = async (workId) => {
    try {
      console.log("Deleting work:", workId);
      await AxiosInstance.delete(`/work/${workId}`);
      setWorks((prev) => prev.filter((w) => w._id !== workId));
      setMessage("Work deleted successfully.");
      toast.success("Work deleted successfully!");
    } catch (err) {
      console.error("Delete Work Error:", err);
      setMessage("Delete work failed.");
      toast.error(err?.response?.data?.message || "Delete work failed");
    }
  };

  // Mark assigned user's status
  const markUserStatus = async (workId, userId, status) => {
    try {
      console.log("Marking status:", { workId, userId, status });
      const res = await AxiosInstance.put(`/work/${workId}/status`, {
        userId,
        status,
      });
      setWorks((prev) =>
        prev.map((w) => (w._id === workId ? res.data.work : w))
      );
      setMessage("User status updated.");
      toast.success("User status updated!");
    } catch (err) {
      console.error("Mark User Status Error:", err);
      setMessage("Failed to update user status.");
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  // Fetch single work with assigned user statuses
  const fetchWorkWithStatus = async (workId) => {
    try {
      const res = await AxiosInstance.get(`/work/${workId}`);
      console.log("Fetched single work:", res.data._id);
      return res.data;
    } catch (err) {
      console.error("Fetch Work With Status Error:", err);
      setMessage("Failed to fetch work details.");
      toast.error(err?.response?.data?.message || "Failed to fetch work");
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
